const { prefixToField } = require('../provable/binable.js'); // import { prefixToField } from '../provable/binable.js';
function createHashHelpers(Field, Hash) {
    function salt(prefix) {
        return Hash.update(Hash.initialState(), [prefixToField(Field, prefix)]);
    }
    function emptyHashWithPrefix(prefix) {
        return salt(prefix)[0];
    }
    function hashWithPrefix(prefix, input) {
        let init = salt(prefix);
        return Hash.update(init, input)[0];
    }
    return { salt, emptyHashWithPrefix, hashWithPrefix };
}
module.exports = { createHashHelpers }; // export { createHashHelpers };
//# sourceMappingURL=hash-generic.js.map