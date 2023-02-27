const { blake2b } = require('blakejs'); // import { blake2b } from 'blakejs';
const { Field } = require('../../provable/field-bigint.js'); // import { Field } from '../../provable/field-bigint.js';
const { Group, Scalar, versionNumbers, PublicKey } = require('../../provable/curve-bigint.js'); // import { Group, Scalar, versionNumbers, PublicKey, } from '../../provable/curve-bigint.js';
const { HashInput, hashWithPrefix, packToFields, prefixes, HashInputLegacy, packToFieldsLegacy, inputToBitsLegacy, HashLegacy } = require('../../provable/poseidon-bigint.js'); // import { HashInput, hashWithPrefix, packToFields, prefixes, HashInputLegacy, packToFieldsLegacy, inputToBitsLegacy, HashLegacy, } from '../../provable/poseidon-bigint.js';
const { bitsToBytes, bytesToBits, record, withVersionNumber } = require('../../provable/binable.js'); // import { bitsToBytes, bytesToBits, record, withVersionNumber, } from '../../provable/binable.js';
const { base58 } = require('../../provable/base58.js'); // import { base58 } from '../../provable/base58.js';
const { versionBytes } = require('../../js_crypto/constants.js'); // import { versionBytes } from '../../js_crypto/constants.js';
const { Pallas } = require('../../js_crypto/elliptic_curve.js'); // import { Pallas } from '../../js_crypto/elliptic_curve.js';
const networkIdMainnet = 0x01n;
const networkIdTestnet = 0x00n;
const BinableSignature = withVersionNumber(record({ r: Field, s: Scalar }, ['r', 's']), versionNumbers.signature);
const Signature = {
    ...BinableSignature,
    ...base58(BinableSignature, versionBytes.signature),
    toJSON({ r, s }) {
        return { field: Field.toJSON(r), scalar: Scalar.toJSON(s) };
    },
    fromJSON({ field, scalar }) {
        let r = Field.fromJSON(field);
        let s = Scalar.fromJSON(scalar);
        return { r, s };
    },
};
/**
 * Convenience wrapper around {@link sign} where the message is a single {@link Field} element
 */
function signFieldElement(message, privateKey, networkId) {
    return sign({ fields: [message] }, privateKey, networkId);
}
/**
 * Convenience wrapper around {@link verify} where the message is a single {@link Field} element
 */
function verifyFieldElement(signature, message, publicKey, networkId) {
    return verify(signature, { fields: [message] }, publicKey, networkId);
}
/**
 * Schnorr signature algorithm consistent with the OCaml implementation in Schnorr.Chunked.sign, over
 * the Pallas curve with the original "Mina" generator.
 *
 * @see {@link https://github.com/MinaProtocol/mina/blob/develop/docs/specs/signatures/description.md detailed spec of the algorithm}
 *
 * In contrast to the spec above, this uses the "chunked" style of hash input packing, implemented in {@link packToFields}.
 *
 * @param message The `message` can be an arbitrary {@link HashInput}, that can be created with
 * `ProvableExtended<T>.toInput(t)` for any provable type `T`, and by concatenating multiple hash inputs
 * with {@link HashInput.append}.
 * Currently, we only use the variant {@link signFieldElement} where the message is a single field element,
 * which itself is the result of computing a hash.
 *
 * @param privateKey The `privateKey` represents an element of the Pallas scalar field, and should be given as a native bigint.
 * It can be converted from the base58 string representation using {@link PrivateKey.fromBase58}.
 *
 * @param networkId The `networkId` is either "testnet" or "mainnet" and ensures that testnet transactions can
 * never be used as valid mainnet transactions.
 *
 * @see {@link deriveNonce} and {@link hashMessage} for details on how the nonce and hash are computed.
 */
function sign(message, privateKey, networkId) {
    let publicKey = Group.scale(Group.generatorMina, privateKey);
    let kPrime = deriveNonce(message, publicKey, privateKey, networkId);
    if (Scalar.equal(kPrime, 0n))
        throw Error('sign: derived nonce is 0');
    let { x: rx, y: ry } = Group.scale(Group.generatorMina, kPrime);
    let k = Field.isEven(ry) ? kPrime : Scalar.negate(kPrime);
    let e = hashMessage(message, publicKey, rx, networkId);
    let s = Scalar.add(k, Scalar.mul(e, privateKey));
    return { r: rx, s };
}
/**
 * Deterministically derive the nonce for the Schnorr signature algorithm, by:
 * - packing all inputs into a byte array,
 * - applying the [blake2b](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) hash function, and
 * - interpreting the resulting 32 bytes as an element of the Pallas curve scalar field (by dropping bits 254 and 255).
 *
 * @see {@link https://github.com/MinaProtocol/mina/blob/develop/docs/specs/signatures/description.md detailed spec of the algorithm}
 *
 * In contrast to the spec above, this uses the "chunked" style of hash input packing, implemented in {@link packToFields}.
 *
 * Input arguments are the same as for {@link sign}, with an additional `publicKey` (a non-zero, affine point on the Pallas curve),
 * which `sign` re-derives by scaling the Pallas "Mina" generator by the `privateKey`.
 */
function deriveNonce(message, publicKey, privateKey, networkId) {
    let { x, y } = publicKey;
    let d = Field(privateKey);
    let id = networkId === 'mainnet' ? networkIdMainnet : networkIdTestnet;
    let input = HashInput.append(message, {
        fields: [x, y, d],
        packed: [[id, 8]],
    });
    let packedInput = packToFields(input);
    let inputBits = packedInput.map(Field.toBits).flat();
    let inputBytes = bitsToBytes(inputBits);
    let bytes = blake2b(Uint8Array.from(inputBytes), undefined, 32);
    // drop the top two bits to convert into a scalar field element
    // (creates negligible bias because q = 2^254 + eps, eps << q)
    bytes[bytes.length - 1] &= 0x3f;
    return Scalar.fromBytes([...bytes]);
}
/**
 * Hash a message for use by the Schnorr signature algorithm, by:
 * - packing the inputs `message`, `publicKey`, `r` into an array of Pallas base field elements,
 * - apply a salted hash with the {@link Poseidon} hash function,
 * - interpreting the resulting base field element as a scalar
 *   (which is always possible, and is a no-op, since the scalar field is larger and both fields are represented with bigints).
 *
 * @see {@link https://github.com/MinaProtocol/mina/blob/develop/docs/specs/signatures/description.md detailed spec of the algorithm}
 *
 * In contrast to the spec above, this uses the "chunked" style of hash input packing, implemented in {@link packToFields}.
 *
 * @param message an arbitrary {@link HashInput}
 * @param publicKey an affine, non-zero point on the Pallas curve, derived by {@link sign} from the private key
 * @param r an element of the Pallas base field, computed by {@link sign} as the x-coordinate of the generator, scaled by the nonce.
 * @param networkId either "testnet" or "mainnet", determines the salt (initial state) in the Poseidon hash.
 */
function hashMessage(message, publicKey, r, networkId) {
    let { x, y } = publicKey;
    let input = HashInput.append(message, { fields: [x, y, r] });
    let prefix = networkId === 'mainnet'
        ? prefixes.signatureMainnet
        : prefixes.signatureTestnet;
    return hashWithPrefix(prefix, packToFields(input));
}
/**
 * Verifies a signature created by {@link sign}, returns `true` if (and only if) the signature is valid.
 *
 * @see {@link https://github.com/MinaProtocol/mina/blob/develop/docs/specs/signatures/description.md detailed spec of the algorithm}
 *
 * In contrast to the spec above, this uses the "chunked" style of hash input packing, implemented in {@link packToFields}.
 *
 * @param publicKey the public key has to be passed in as a compressed {@link PublicKey}.
 * It can be created from a base58 string with {@link PublicKey.fromBase58}.
 */
function verify(signature, message, publicKey, networkId) {
    let { r, s } = signature;
    let pk = PublicKey.toGroup(publicKey);
    let e = hashMessage(message, pk, r, networkId);
    let { scale, one, sub } = Pallas;
    let R = sub(scale(one, s), scale(Group.toProjective(pk), e));
    try {
        // if `R` is infinity, Group.fromProjective throws an error, so `verify` returns false
        let { x: rx, y: ry } = Group.fromProjective(R);
        return Field.isEven(ry) && Field.equal(rx, r);
    }
    catch {
        return false;
    }
}
// legacy signatures
/**
 * Same as {@link sign}, but using the "legacy" style of hash input packing.
 */
function signLegacy(message, privateKey, networkId) {
    let publicKey = Group.scale(Group.generatorMina, privateKey);
    let kPrime = deriveNonceLegacy(message, publicKey, privateKey, networkId);
    if (Scalar.equal(kPrime, 0n))
        throw Error('sign: derived nonce is 0');
    let { x: rx, y: ry } = Group.scale(Group.generatorMina, kPrime);
    let k = Field.isEven(ry) ? kPrime : Scalar.negate(kPrime);
    let e = hashMessageLegacy(message, publicKey, rx, networkId);
    let s = Scalar.add(k, Scalar.mul(e, privateKey));
    return { r: rx, s };
}
/**
 * Same as {@link verify}, but using the "legacy" style of hash input packing.
 */
function verifyLegacy(signature, message, publicKey, networkId) {
    try {
        let { r, s } = signature;
        let pk = PublicKey.toGroup(publicKey);
        let e = hashMessageLegacy(message, pk, r, networkId);
        let { scale, one, sub } = Pallas;
        let R = sub(scale(one, s), scale(Group.toProjective(pk), e));
        // if `R` is infinity, Group.fromProjective throws an error, so `verify` returns false
        let { x: rx, y: ry } = Group.fromProjective(R);
        return Field.isEven(ry) && Field.equal(rx, r);
    }
    catch {
        return false;
    }
}
/**
 * Same as {@link deriveNonce}, but using the "legacy" style of hash input packing.
 */
function deriveNonceLegacy(message, publicKey, privateKey, networkId) {
    let { x, y } = publicKey;
    let scalarBits = Scalar.toBits(privateKey);
    let id = networkId === 'mainnet' ? networkIdMainnet : networkIdTestnet;
    let idBits = bytesToBits([Number(id)]);
    let input = HashInputLegacy.append(message, {
        fields: [x, y],
        bits: [...scalarBits, ...idBits],
    });
    let inputBits = inputToBitsLegacy(input);
    let inputBytes = bitsToBytes(inputBits);
    let bytes = blake2b(Uint8Array.from(inputBytes), undefined, 32);
    // drop the top two bits to convert into a scalar field element
    // (creates negligible bias because q = 2^254 + eps, eps << q)
    bytes[bytes.length - 1] &= 0x3f;
    return Scalar.fromBytes([...bytes]);
}
/**
 * Same as {@link hashMessage}, but using the "legacy" style of hash input packing.
 */
function hashMessageLegacy(message, publicKey, r, networkId) {
    let { x, y } = publicKey;
    let input = HashInputLegacy.append(message, { fields: [x, y, r], bits: [] });
    let prefix = networkId === 'mainnet'
        ? prefixes.signatureMainnet
        : prefixes.signatureTestnet;
    return HashLegacy.hashWithPrefix(prefix, packToFieldsLegacy(input));
}
module.exports = { sign, verify, signFieldElement, verifyFieldElement, Signature, signLegacy, verifyLegacy }; // export { sign, verify, signFieldElement, verifyFieldElement, Signature, signLegacy, verifyLegacy, };
//# sourceMappingURL=signature.js.map