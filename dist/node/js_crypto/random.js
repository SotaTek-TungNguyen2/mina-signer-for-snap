const { randomBytes: randomBytesNode } = require('crypto'); // import { randomBytes as randomBytesNode } from 'crypto';
function randomBytes(n) {
    return new Uint8Array(randomBytesNode(n));
}
module.exports = { randomBytes }; // export { randomBytes };
//# sourceMappingURL=random.js.map