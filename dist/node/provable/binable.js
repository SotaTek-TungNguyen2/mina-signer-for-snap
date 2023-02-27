// generic encoding infrastructure
const { bytesToBigInt, bigIntToBytes } = require('../js_crypto/bigint-helpers.js'); // import { bytesToBigInt, bigIntToBytes } from '../js_crypto/bigint-helpers.js';

function defineBinable({ toBytes, readBytes, }) {
    return {
        toBytes,
        readBytes,
        // spec: fromBytes throws if the input bytes are not all used
        fromBytes(bytes) {
            let [value, offset] = readBytes(bytes, 0);
            if (offset < bytes.length)
                throw Error('fromBytes: input bytes left over');
            return value;
        },
    };
}
function withVersionNumber(binable, versionNumber) {
    return defineBinable({
        toBytes(t) {
            let bytes = binable.toBytes(t);
            if (versionNumber !== undefined)
                bytes.unshift(versionNumber);
            return bytes;
        },
        readBytes(bytes, offset) {
            if (versionNumber !== undefined)
                offset++;
            return binable.readBytes(bytes, offset);
        },
    });
}
function withCheck({ toBytes, readBytes }, check) {
    return defineBinable({
        toBytes,
        readBytes(bytes, start) {
            let [value, end] = readBytes(bytes, start);
            check(value);
            return [value, end];
        },
    });
}
function record(binables, keys) {
    let binablesTuple = keys.map((key) => binables[key]);
    let tupleBinable = tuple(binablesTuple);
    return defineBinable({
        toBytes(t) {
            let array = keys.map((key) => t[key]);
            return tupleBinable.toBytes(array);
        },
        readBytes(bytes, start) {
            let [tupleValue, end] = tupleBinable.readBytes(bytes, start);
            let value = Object.fromEntries(keys.map((key, i) => [key, tupleValue[i]]));
            return [value, end];
        },
    });
}
function tuple(binables) {
    let n = binables.length;
    return defineBinable({
        toBytes(t) {
            let bytes = [];
            for (let i = 0; i < n; i++) {
                let subBytes = binables[i].toBytes(t[i]);
                bytes.push(...subBytes);
            }
            return bytes;
        },
        readBytes(bytes, offset) {
            let values = [];
            for (let i = 0; i < n; i++) {
                let [value, newOffset] = binables[i].readBytes(bytes, offset);
                offset = newOffset;
                values.push(value);
            }
            return [values, offset];
        },
    });
}
function enumWithArgument(types) {
    let typeToIndex = Object.fromEntries(types.map(({ type }, i) => [type, i]));
    return defineBinable({
        toBytes(en) {
            let i = typeToIndex[en.type];
            let type = types[i];
            if ('value' in type) {
                let binable = type.value;
                return [i, ...binable.toBytes(en.value)];
            }
            return [i];
        },
        readBytes(bytes, offset) {
            let i = bytes[offset];
            offset++;
            let type = types[i];
            if ('value' in type) {
                let [value, end] = type.value.readBytes(bytes, offset);
                return [{ type: type.type, value }, end];
            }
            return [{ type: type.type }, offset];
        },
    });
}
const BinableString = defineBinable({
    toBytes(t) {
        return [t.length, ...stringToBytes(t)];
    },
    readBytes(bytes, offset) {
        let length = bytes[offset++];
        let end = offset + length;
        let string = String.fromCharCode(...bytes.slice(offset, end));
        return [string, end];
    },
});
const CODE_NEG_INT8 = 0xff;
const CODE_INT16 = 0xfe;
const CODE_INT32 = 0xfd;
const CODE_INT64 = 0xfc;
const BinableBigintInteger = defineBinable({
    toBytes(n) {
        if (n >= 0) {
            if (n < 0x80n)
                return bigIntToBytes(n, 1);
            if (n < 0x8000n)
                return [CODE_INT16, ...bigIntToBytes(n, 2)];
            if (n < 0x80000000)
                return [CODE_INT32, ...bigIntToBytes(n, 4)];
            else
                return [CODE_INT64, ...bigIntToBytes(n, 8)];
        }
        else {
            let M = 1n << 64n;
            if (n >= -0x80n)
                return [CODE_NEG_INT8, ...bigIntToBytes((M + n) & 0xffn, 1)];
            if (n >= -0x8000n)
                return [CODE_INT16, ...bigIntToBytes((M + n) & 0xffffn, 2)];
            if (n >= -0x80000000)
                return [CODE_INT32, ...bigIntToBytes((M + n) & 0xffffffffn, 4)];
            else
                return [CODE_INT64, ...bigIntToBytes(M + n, 8)];
        }
    },
    readBytes(bytes, offset) {
        let code = bytes[offset++];
        if (code < 0x80)
            return [BigInt(code), offset];
        let size = {
            [CODE_NEG_INT8]: 1,
            [CODE_INT16]: 2,
            [CODE_INT32]: 4,
            [CODE_INT64]: 8,
        }[code];
        if (size === undefined) {
            throw Error('binable integer: invalid start byte');
        }
        let end = offset + size;
        let x = fillInt64(bytes.slice(offset, end));
        return [x, end];
    },
});
function fillInt64(startBytes) {
    let n = startBytes.length;
    // fill up int64 with the highest bit of startBytes
    let lastBit = startBytes[n - 1] >> 7;
    let fillByte = lastBit === 1 ? 0xff : 0x00;
    let intBytes = startBytes.concat(Array(8 - n).fill(fillByte));
    // interpret result as a bigint > 0
    let x = bytesToBigInt(intBytes);
    // map from uint64 range to int64 range
    if (x >= 1n << 63n)
        x -= 1n << 64n;
    return x;
}
// same as Random_oracle.prefix_to_field in OCaml
// converts string to bytes and bytes to field; throws if bytes don't fit in one field
function prefixToField(Field, prefix) {
    if (prefix.length >= Field.sizeInBytes())
        throw Error('prefix too long');
    return Field.fromBytes(stringToBytes(prefix));
}
function bitsToBytes([...bits]) {
    let bytes = [];
    while (bits.length > 0) {
        let byteBits = bits.splice(0, 8);
        let byte = 0;
        for (let i = 0; i < 8; i++) {
            if (!byteBits[i])
                continue;
            byte |= 1 << i;
        }
        bytes.push(byte);
    }
    return bytes;
}
function bytesToBits(bytes) {
    return bytes
        .map((byte) => {
        let bits = Array(8);
        for (let i = 0; i < 8; i++) {
            bits[i] = !!(byte & 1);
            byte >>= 1;
        }
        return bits;
    })
        .flat();
}
/**
 * This takes a `Binable<T>` plus an optional `sizeInBits`, and derives toBits() / fromBits() functions.
 * - `sizeInBits` has to observe `Math.ceil(sizeInBits / 8) === sizeInBytes`, so the bit size can be slightly smaller than the byte size
 * - If `sizeInBits` is `< sizeInBytes * 8`, then we assume that toBytes() returns a byte sequence where the bits
 *   higher than `sizeInBits` are all 0. This assumption manifests in toBits(), where we slice off those higher bits,
 *   to return a result that is of length `sizeInBits`.
 *
 * This is useful for serializing field elements, where -- depending on the circumstance -- we either want a
 * 32-byte (= 256-bit) serialization, or a 255-bit serialization
 */
function withBits(binable, sizeInBits) {
    return {
        ...binable,
        toBits(t) {
            return bytesToBits(binable.toBytes(t)).slice(0, sizeInBits);
        },
        fromBits(bits) {
            return binable.fromBytes(bitsToBytes(bits));
        },
        sizeInBytes() {
            return Math.ceil(sizeInBits / 8);
        },
        sizeInBits() {
            return sizeInBits;
        },
    };
}
function stringToBytes(s) {
    return [...s].map((_, i) => s.charCodeAt(i));
}
module.exports = { defineBinable, withVersionNumber, tuple, record, enumWithArgument, prefixToField, bytesToBits, bitsToBytes, withBits, withCheck, stringToBytes, BinableString, BinableBigintInteger }; // export { defineBinable, withVersionNumber, tuple, record, enumWithArgument, prefixToField, bytesToBits, bitsToBytes, withBits, withCheck, stringToBytes, BinableString, BinableBigintInteger, };
//# sourceMappingURL=binable.js.map