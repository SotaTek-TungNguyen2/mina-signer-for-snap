// @generated this file is auto-generated - don't edit it directly
const { PublicKey, UInt64, UInt32, TokenId, Field, Bool, AuthRequired, TokenSymbol, Sign, AuthorizationKind, ZkappUri, Events, SequenceEvents, SequenceState } = require('../transaction-leaves-bigint.js'); // import { PublicKey, UInt64, UInt32, TokenId, Field, Bool, AuthRequired, TokenSymbol, Sign, AuthorizationKind, ZkappUri, Events, SequenceEvents, SequenceState, } from '../transaction-leaves-bigint.js';
const { ProvableFromLayout } = require('../../provable/from-layout.js'); // import { ProvableFromLayout, } from '../../provable/from-layout.js';
const Json = require('./transaction-json.js'); // import * as Json from './transaction-json.js';
const { jsLayout } = require('./js-layout.js'); // import { jsLayout } from './js-layout.js';
const TypeMap = {
    PublicKey,
    UInt64,
    UInt32,
    TokenId,
    Field,
    Bool,
    AuthRequired,
    Sign,
    AuthorizationKind,
};
let customTypes = {
    ZkappUri,
    TokenSymbol,
    Events,
    SequenceEvents,
    SequenceState,
};
let { provableFromLayout, toJSONEssential } = ProvableFromLayout(TypeMap, customTypes);
let ZkappCommand = provableFromLayout(jsLayout.ZkappCommand);
let AccountUpdate = provableFromLayout(jsLayout.AccountUpdate);
module.exports = { 
    customTypes, ZkappCommand, AccountUpdate, // export { customTypes, ZkappCommand, AccountUpdate };
    Json, // export { Json };
    ...require('../transaction-leaves-bigint.js'), // export * from '../transaction-leaves-bigint.js';
    provableFromLayout, toJSONEssential // export { provableFromLayout, toJSONEssential };
};
//# sourceMappingURL=transaction-bigint.js.map