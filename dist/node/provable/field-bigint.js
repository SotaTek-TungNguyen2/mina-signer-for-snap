const { bigIntToBytes } = require('../js_crypto/bigint-helpers.js'); // import { bigIntToBytes } from '../js_crypto/bigint-helpers.js';
const { Fp, mod } = require('../js_crypto/finite_field.js'); // import { Fp, mod } from '../js_crypto/finite_field.js';
const { defineBinable, withBits } = require('./binable.js'); // import { defineBinable, withBits } from './binable.js';

// export { Field, Bool, UInt32, UInt64, Sign };
// export { pseudoClass, ProvableBigint, BinableBigint, sizeInBits, checkRange, checkField, };
const sizeInBits = Fp.sizeInBits;
const minusOne = 0x40000000000000000000000000000000224698fc094cf91b992d30ed00000000n;
const checkField = checkRange(0n, Fp.modulus, 'Field');
const checkBool = checkWhitelist(new Set([0n, 1n]), 'Bool');
const checkSign = checkWhitelist(new Set([1n, minusOne]), 'Sign');
/**
 * The base field of the Pallas curve
 */
const Field = pseudoClass(function Field(value) {
    return mod(BigInt(value), Fp.modulus);
}, {
    ...ProvableBigint(checkField),
    ...BinableBigint(Fp.sizeInBits, checkField),
    ...Fp,
});
/**
 * A field element which is either 0 or 1
 */
const Bool = pseudoClass(function Bool(value) {
    return BigInt(value);
}, {
    ...ProvableBigint(checkBool),
    ...BinableBigint(1, checkBool),
    toInput(x) {
        return { fields: [], packed: [[x, 1]] };
    },
    toBoolean(x) {
        return !!x;
    },
    toJSON(x) {
        return !!x;
    },
    fromJSON(b) {
        let x = BigInt(b);
        checkBool(x);
        return x;
    },
    sizeInBytes() {
        return 1;
    },
    fromField(x) {
        checkBool(x);
        return x;
    },
});
function Unsigned(bits) {
    let maxValue = (1n << BigInt(bits)) - 1n;
    let checkUnsigned = checkRange(0n, 1n << BigInt(bits), `UInt${bits}`);
    return pseudoClass(function Unsigned(value) {
        let x = BigInt(value);
        checkUnsigned(x);
        return x;
    }, {
        ...ProvableBigint(checkUnsigned),
        ...BinableBigint(bits, checkUnsigned),
        toInput(x) {
            return { fields: [], packed: [[x, bits]] };
        },
        maxValue,
    });
}
const UInt32 = Unsigned(32);
const UInt64 = Unsigned(64);
const Sign = pseudoClass(function Sign(value) {
    if (value !== 1 && value !== -1)
        throw Error('Sign: input must be 1 or -1.');
    return (BigInt(value) % Fp.modulus);
}, {
    ...ProvableBigint(checkSign),
    ...BinableBigint(1, checkSign),
    emptyValue() {
        return 1n;
    },
    toInput(x) {
        return { fields: [], packed: [[x === 1n ? 1n : 0n, 1]] };
    },
    fromFields([x]) {
        if (x === 0n)
            return 1n;
        checkSign(x);
        return x;
    },
    toJSON(x) {
        return x === 1n ? 'Positive' : 'Negative';
    },
    fromJSON(x) {
        if (x !== 'Positive' && x !== 'Negative')
            throw Error('Sign: invalid input');
        return x === 'Positive' ? 1n : minusOne;
    },
});
// helper
function pseudoClass(constructor, module) {
    return Object.assign(constructor, module);
}
function ProvableBigint(check) {
    return {
        sizeInFields() {
            return 1;
        },
        toFields(x) {
            return [x];
        },
        toAuxiliary() {
            return [];
        },
        check,
        fromFields([x]) {
            check(x);
            return x;
        },
        toInput(x) {
            return { fields: [x], packed: [] };
        },
        toJSON(x) {
            return x.toString();
        },
        fromJSON(json) {
            let x = BigInt(json);
            check(x);
            return x;
        },
    };
}
function BinableBigint(sizeInBits, check) {
    let sizeInBytes = Math.ceil(sizeInBits / 8);
    return withBits(defineBinable({
        toBytes(x) {
            return bigIntToBytes(x, sizeInBytes);
        },
        readBytes(bytes, start) {
            let x = 0n;
            let bitPosition = 0n;
            let end = Math.min(start + sizeInBytes, bytes.length);
            for (let i = start; i < end; i++) {
                x += BigInt(bytes[i]) << bitPosition;
                bitPosition += 8n;
            }
            check(x);
            return [x, end];
        },
    }), sizeInBits);
}
// validity checks
function checkRange(lower, upper, name) {
    return (x) => {
        if (x < lower)
            throw Error(`${name}: inputs smaller than ${lower} are not allowed, got ${x}`);
        if (x >= upper)
            throw Error(`${name}: inputs larger than ${upper - 1n} are not allowed, got ${x}`);
    };
}
function checkWhitelist(valid, name) {
    return (x) => {
        if (!valid.has(x)) {
            throw Error(`${name}: input must be one of ${[...valid].join(', ')}, got ${x}`);
        }
    };
}
module.exports = {
    Field, Bool, UInt32, UInt64, Sign,
    pseudoClass, ProvableBigint, BinableBigint, sizeInBits, checkRange, checkField
};
//# sourceMappingURL=field-bigint.js.map