const { Fq } = require('../js_crypto/finite_field.js'); // import { Fq } from '../js_crypto/finite_field.js';
const { Pallas } = require('../js_crypto/elliptic_curve.js'); // import { Pallas } from '../js_crypto/elliptic_curve.js';
const { versionBytes } = require('../js_crypto/constants.js'); // import { versionBytes } from '../js_crypto/constants.js';
const { record, withCheck, withVersionNumber } = require('./binable.js'); // import { record, withCheck, withVersionNumber } from './binable.js';
const { base58, withBase58 } = require('./base58.js'); // import { base58, withBase58 } from './base58.js';
const { BinableBigint, Bool, checkRange, Field, ProvableBigint, pseudoClass } = require('./field-bigint.js'); // import { BinableBigint, Bool, checkRange, Field, ProvableBigint, pseudoClass, } from './field-bigint.js';
const { provable } = require('./provable-bigint.js'); // import { provable } from './provable-bigint.js';
// TODO generate
const versionNumbers = {
    field: 1,
    scalar: 1,
    publicKey: 1,
    signature: 1,
};
/**
 * A non-zero point on the Pallas curve in affine form { x, y }
 */
const Group = {
    toProjective({ x, y }) {
        return Pallas.ofAffine({ x, y, infinity: false });
    },
    /**
     * Convert a projective point to a non-zero affine point.
     * Throws an error if the point is zero / infinity, i.e. if z === 0
     */
    fromProjective(point) {
        let { x, y, infinity } = Pallas.toAffine(point);
        if (infinity)
            throw Error('Group.fromProjective: point is infinity');
        return { x, y };
    },
    get generatorMina() {
        return Group.fromProjective(Pallas.one);
    },
    scale(point, scalar) {
        return Group.fromProjective(Pallas.scale(Group.toProjective(point), scalar));
    },
};
let FieldWithVersion = withVersionNumber(Field, versionNumbers.field);
let BinablePublicKey = withVersionNumber(withCheck(record({ x: FieldWithVersion, isOdd: Bool }, ['x', 'isOdd']), ({ x }) => {
    let { mul, add } = Field;
    let ySquared = add(mul(x, mul(x, x)), 5n);
    if (!Field.isSquare(ySquared)) {
        throw Error('PublicKey: not a valid group element');
    }
}), versionNumbers.publicKey);
/**
 * A public key, represented by a non-zero point on the Pallas curve, in compressed form { x, isOdd }
 */
const PublicKey = {
    ...provable({ x: Field, isOdd: Bool }),
    ...withBase58(BinablePublicKey, versionBytes.publicKey),
    toJSON(publicKey) {
        return PublicKey.toBase58(publicKey);
    },
    fromJSON(json) {
        return PublicKey.fromBase58(json);
    },
    toGroup({ x, isOdd }) {
        let { mul, add } = Field;
        let ySquared = add(mul(x, mul(x, x)), 5n);
        let y = Field.sqrt(ySquared);
        if (y === undefined) {
            throw Error('PublicKey.toGroup: not a valid group element');
        }
        if (isOdd !== (y & 1n))
            y = Field.negate(y);
        return { x, y };
    },
    fromGroup({ x, y }) {
        let isOdd = (y & 1n);
        return { x, isOdd };
    },
    toInputLegacy({ x, isOdd }) {
        return { fields: [x], bits: [!!isOdd] };
    },
};
const checkScalar = checkRange(0n, Fq.modulus, 'Scalar');
/**
 * The scalar field of the Pallas curve
 */
const Scalar = pseudoClass(function Scalar(value) {
    return BigInt(value) % Fq.modulus;
}, {
    ...ProvableBigint(checkScalar),
    ...BinableBigint(Fq.sizeInBits, checkScalar),
    ...Fq,
});
let BinablePrivateKey = withVersionNumber(Scalar, versionNumbers.scalar);
let Base58PrivateKey = base58(BinablePrivateKey, versionBytes.privateKey);
/**
 * A private key, represented by a scalar of the Pallas curve
 */
const PrivateKey = {
    ...Scalar,
    ...provable(Scalar),
    ...Base58PrivateKey,
    ...BinablePrivateKey,
    toPublicKey(key) {
        return PublicKey.fromGroup(Group.scale(Group.generatorMina, key));
    },
};
module.exports = { Group, PublicKey, Scalar, PrivateKey, versionNumbers }; // export { Group, PublicKey, Scalar, PrivateKey, versionNumbers };
//# sourceMappingURL=curve-bigint.js.map