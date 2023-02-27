const { createProvable } = require('./provable-generic.js'); // import { createProvable } from './provable-generic.js';
const { bytesToBits, prefixToField, stringToBytes } = require('./binable.js'); // import { bytesToBits, prefixToField, stringToBytes } from './binable.js';
const { fieldEncodings } = require('./base58.js'); // import { fieldEncodings } from './base58.js';
const { dataAsHash } = require('../lib/events.js'); // import { dataAsHash } from '../lib/events.js';
const { prefixes } = require('../js_crypto/constants.js'); // import { prefixes } from '../js_crypto/constants.js';
function derivedLeafTypes({ Field, Bool, Hash, packToFields, }) {
    let provable = createProvable();
    const Encoding = fieldEncodings(Field);
    const defaultTokenId = 1;
    const TokenId = {
        ...provable(Field),
        emptyValue() {
            return Field(defaultTokenId);
        },
        toJSON(x) {
            return Encoding.TokenId.toBase58(x);
        },
        fromJSON(x) {
            return Encoding.TokenId.fromBase58(x);
        },
    };
    const TokenSymbol = {
        ...provable({ field: Field, symbol: String }),
        toInput({ field }) {
            return { packed: [[field, 48]] };
        },
        toJSON({ symbol }) {
            return symbol;
        },
        fromJSON(symbol) {
            return { symbol, field: prefixToField(Field, symbol) };
        },
    };
    const AuthRequired = {
        ...provable({ constant: Bool, signatureNecessary: Bool, signatureSufficient: Bool }, {
            customObjectKeys: [
                'constant',
                'signatureNecessary',
                'signatureSufficient',
            ],
        }),
        emptyValue() {
            return {
                constant: Bool(true),
                signatureNecessary: Bool(false),
                signatureSufficient: Bool(true),
            };
        },
        toJSON(x) {
            let c = Number(Bool.toJSON(x.constant));
            let n = Number(Bool.toJSON(x.signatureNecessary));
            let s = Number(Bool.toJSON(x.signatureSufficient));
            // prettier-ignore
            switch (`${c}${n}${s}`) {
                case '110': return 'Impossible';
                case '101': return 'None';
                case '000': return 'Proof';
                case '011': return 'Signature';
                case '001': return 'Either';
                default: throw Error('Unexpected permission');
            }
        },
        fromJSON(json) {
            let map = {
                Impossible: '110',
                None: '101',
                Proof: '000',
                Signature: '011',
                Either: '001',
            };
            let code = map[json];
            if (code === undefined)
                throw Error('Unexpected permission');
            let [constant, signatureNecessary, signatureSufficient] = code
                .split('')
                .map((s) => Bool(!!Number(s)));
            return { constant, signatureNecessary, signatureSufficient };
        },
    };
    const AuthorizationKind = {
        ...provable({ isSigned: Bool, isProved: Bool }, {
            customObjectKeys: ['isSigned', 'isProved'],
        }),
        toJSON(x) {
            let isSigned = Number(Bool.toJSON(x.isSigned));
            let isProved = Number(Bool.toJSON(x.isProved));
            // prettier-ignore
            switch (`${isSigned}${isProved}`) {
                case '00': return 'None_given';
                case '10': return 'Signature';
                case '01': return 'Proof';
                default: throw Error('Unexpected authorization kind');
            }
        },
        fromJSON(json) {
            let booleans = {
                None_given: [false, false],
                Signature: [true, false],
                Proof: [false, true],
            }[json];
            if (booleans === undefined)
                throw Error('Unexpected authorization kind');
            let [isSigned, isProved] = booleans.map(Bool);
            return { isSigned, isProved };
        },
    };
    // Mina_base.Zkapp_account.hash_zkapp_uri_opt
    function hashZkappUri(uri) {
        let bits = bytesToBits(stringToBytes(uri));
        bits.push(true);
        let input = { packed: bits.map((b) => [Field(Number(b)), 1]) };
        let packed = packToFields(input);
        return Hash.hashWithPrefix(prefixes.zkappUri, packed);
    }
    const ZkappUri = dataAsHash({
        emptyValue() {
            let hash = Hash.hashWithPrefix(prefixes.zkappUri, [Field(0), Field(0)]);
            return { data: '', hash };
        },
        toJSON(data) {
            return data;
        },
        fromJSON(json) {
            return { data: json, hash: hashZkappUri(json) };
        },
    });
    return {
        TokenId,
        TokenSymbol,
        AuthRequired,
        AuthorizationKind,
        ZkappUri,
    };
}
module.exports = { derivedLeafTypes }; // export { derivedLeafTypes };
//# sourceMappingURL=derived-leaves.js.map