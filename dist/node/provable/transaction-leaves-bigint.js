const { Field, Bool, UInt32, UInt64, Sign } = require('./field-bigint.js'); // import { Field, Bool, UInt32, UInt64, Sign } from './field-bigint.js';
const { PublicKey } = require('./curve-bigint.js'); // import { PublicKey } from './curve-bigint.js';
const { derivedLeafTypes } = require('./derived-leaves.js'); // import { derivedLeafTypes } from './derived-leaves.js';
const { createEvents } = require('../lib/events.js'); // import { createEvents } from '../lib/events.js';
const { Poseidon, Hash, packToFields } = require('./poseidon-bigint.js'); // import { Poseidon, Hash, packToFields } from './poseidon-bigint.js';
const { TokenId, TokenSymbol, AuthRequired, AuthorizationKind, ZkappUri } = derivedLeafTypes({ Field, Bool, Hash, packToFields });
const { Events, SequenceEvents } = createEvents({ Field, Poseidon });
const SequenceState = {
    ...Field,
    emptyValue: SequenceEvents.emptySequenceState,
};
module.exports = {
    PublicKey, Field, Bool, AuthRequired, AuthorizationKind, UInt64, UInt32, Sign, TokenId, // export { PublicKey, Field, Bool, AuthRequired, AuthorizationKind, UInt64, UInt32, Sign, TokenId, };
    Events, SequenceEvents, ZkappUri, TokenSymbol, SequenceState // export { Events, SequenceEvents, ZkappUri, TokenSymbol, SequenceState };
};
//# sourceMappingURL=transaction-leaves-bigint.js.map