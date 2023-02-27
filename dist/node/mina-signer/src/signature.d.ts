import { Field } from '../../provable/field-bigint.js';
import { Scalar, PrivateKey, PublicKey } from '../../provable/curve-bigint.js';
import { HashInput, HashInputLegacy } from '../../provable/poseidon-bigint.js';
export { sign, verify, signFieldElement, verifyFieldElement, Signature, SignatureJson, NetworkId, signLegacy, verifyLegacy, };
declare type NetworkId = 'mainnet' | 'testnet';
declare type Signature = {
    r: Field;
    s: Scalar;
};
declare type SignatureJson = {
    field: string;
    scalar: string;
};
declare const Signature: {
    toJSON({ r, s }: Signature): SignatureJson;
    fromJSON({ field, scalar }: SignatureJson): {
        r: bigint;
        s: bigint;
    };
    toBase58(t: {
        r: bigint;
        s: bigint;
    }): string;
    fromBase58(base58: string): {
        r: bigint;
        s: bigint;
    };
    toBytes(t: {
        r: bigint;
        s: bigint;
    }): number[];
    readBytes(bytes: number[], offset: number): [value: {
        r: bigint;
        s: bigint;
    }, offset: number];
    fromBytes(bytes: number[]): {
        r: bigint;
        s: bigint;
    };
};
/**
 * Convenience wrapper around {@link sign} where the message is a single {@link Field} element
 */
declare function signFieldElement(message: Field, privateKey: PrivateKey, networkId: NetworkId): Signature;
/**
 * Convenience wrapper around {@link verify} where the message is a single {@link Field} element
 */
declare function verifyFieldElement(signature: Signature, message: Field, publicKey: PublicKey, networkId: NetworkId): boolean;
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
declare function sign(message: HashInput, privateKey: PrivateKey, networkId: NetworkId): Signature;
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
declare function verify(signature: Signature, message: HashInput, publicKey: PublicKey, networkId: NetworkId): boolean;
/**
 * Same as {@link sign}, but using the "legacy" style of hash input packing.
 */
declare function signLegacy(message: HashInputLegacy, privateKey: PrivateKey, networkId: NetworkId): Signature;
/**
 * Same as {@link verify}, but using the "legacy" style of hash input packing.
 */
declare function verifyLegacy(signature: Signature, message: HashInputLegacy, publicKey: PublicKey, networkId: NetworkId): boolean;
