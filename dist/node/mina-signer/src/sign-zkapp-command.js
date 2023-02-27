const { Bool, Sign, UInt32 } = require('../../provable/field-bigint.js'); // import { Bool, Sign, UInt32 } from '../../provable/field-bigint.js';
const { PrivateKey, PublicKey } = require('../../provable/curve-bigint.js'); // import { PrivateKey, PublicKey } from '../../provable/curve-bigint.js';
const { AccountUpdate, ZkappCommand } = require('../../provable/gen/transaction-bigint.js'); // import { AccountUpdate, ZkappCommand, } from '../../provable/gen/transaction-bigint.js';
const { hashWithPrefix, packToFields, prefixes } = require('../../provable/poseidon-bigint.js'); // import { hashWithPrefix, packToFields, prefixes, } from '../../provable/poseidon-bigint.js';
const { Memo } = require('./memo.js'); // import { Memo } from './memo.js';
const { Signature, signFieldElement, verifyFieldElement } = require('./signature.js'); // import { Signature, signFieldElement, verifyFieldElement, } from './signature.js';

function signZkappCommand(zkappCommand_, privateKeyBase58, networkId) {
    let zkappCommand = ZkappCommand.fromJSON(zkappCommand_);
    let fullCommitment = fullTransactionCommitment(zkappCommand);
    let privateKey = PrivateKey.fromBase58(privateKeyBase58);
    let signature = signFieldElement(fullCommitment, privateKey, networkId);
    zkappCommand.feePayer.authorization = Signature.toBase58(signature);
    return ZkappCommand.toJSON(zkappCommand);
}
function verifyZkappCommandSignature(zkappCommand_, publicKeyBase58, networkId) {
    let zkappCommand = ZkappCommand.fromJSON(zkappCommand_);
    let fullCommitment = fullTransactionCommitment(zkappCommand);
    let publicKey = PublicKey.fromBase58(publicKeyBase58);
    let signature = Signature.fromBase58(zkappCommand.feePayer.authorization);
    return verifyFieldElement(signature, fullCommitment, publicKey, networkId);
}
function fullTransactionCommitment(zkappCommand) {
    let callForest = accountUpdatesToCallForest(zkappCommand.accountUpdates);
    let commitment = callForestHash(callForest);
    let memoHash = Memo.hash(Memo.fromBase58(zkappCommand.memo));
    let feePayerDigest = feePayerHash(zkappCommand.feePayer);
    return hashWithPrefix(prefixes.accountUpdateCons, [
        memoHash,
        feePayerDigest,
        commitment,
    ]);
}
/**
 * Turn flat list into a hierarchical structure (forest) by letting the callDepth
 * determine parent-child relationships
 */
function accountUpdatesToCallForest(updates, callDepth = 0) {
    let remainingUpdates = callDepth > 0 ? updates : [...updates];
    let forest = [];
    while (remainingUpdates.length > 0) {
        let accountUpdate = remainingUpdates[0];
        if (accountUpdate.body.callDepth < callDepth)
            return forest;
        console.assert(accountUpdate.body.callDepth === callDepth, 'toCallForest');
        remainingUpdates.shift();
        let children = accountUpdatesToCallForest(remainingUpdates, callDepth + 1);
        forest.push({ accountUpdate, children });
    }
    return forest;
}
function accountUpdateHash(update) {
    let input = AccountUpdate.toInput(update);
    let fields = packToFields(input);
    return hashWithPrefix(prefixes.body, fields);
}
function callForestHash(forest) {
    let stackHash = 0n;
    for (let callTree of [...forest].reverse()) {
        let calls = callForestHash(callTree.children);
        let treeHash = accountUpdateHash(callTree.accountUpdate);
        let nodeHash = hashWithPrefix(prefixes.accountUpdateNode, [
            treeHash,
            calls,
        ]);
        stackHash = hashWithPrefix(prefixes.accountUpdateCons, [
            nodeHash,
            stackHash,
        ]);
    }
    return stackHash;
}
function createFeePayer(feePayer) {
    return { authorization: '', body: feePayer };
}
function feePayerHash(feePayer) {
    let accountUpdate = accountUpdateFromFeePayer(feePayer);
    return accountUpdateHash(accountUpdate);
}
function accountUpdateFromFeePayer({ body: { fee, nonce, publicKey, validUntil }, authorization: signature, }) {
    let { body } = AccountUpdate.emptyValue();
    body.publicKey = publicKey;
    body.balanceChange = { magnitude: fee, sgn: Sign(-1) };
    body.incrementNonce = Bool(true);
    body.preconditions.network.globalSlotSinceGenesis = {
        isSome: Bool(true),
        value: { lower: UInt32(0), upper: validUntil ?? UInt32.maxValue },
    };
    body.preconditions.account.nonce = {
        isSome: Bool(true),
        value: { lower: nonce, upper: nonce },
    };
    // TODO: special permission here is ugly and should be replaced with auto-generated thing
    // could be removed if we either
    // -) change the default hash input for permissions in the protocol
    // -) create a way to add a custom dummy for permissions
    let Signature = {
        constant: Bool(false),
        signatureNecessary: Bool(true),
        signatureSufficient: Bool(true),
    };
    let None = {
        constant: Bool(true),
        signatureNecessary: Bool(false),
        signatureSufficient: Bool(true),
    };
    body.update.permissions.value = {
        editState: Signature,
        send: Signature,
        receive: None,
        setDelegate: Signature,
        setPermissions: Signature,
        setVerificationKey: Signature,
        setZkappUri: Signature,
        editSequenceState: Signature,
        setTokenSymbol: Signature,
        incrementNonce: Signature,
        setVotingFor: Signature,
    };
    body.useFullCommitment = Bool(true);
    body.authorizationKind = { isProved: Bool(false), isSigned: Bool(true) };
    return { body, authorization: { signature } };
}

module.exports = {
    signZkappCommand, verifyZkappCommandSignature, // external API | export { signZkappCommand, verifyZkappCommandSignature };
    accountUpdatesToCallForest, callForestHash, accountUpdateHash, feePayerHash, createFeePayer, accountUpdateFromFeePayer // internal API | export { accountUpdatesToCallForest, callForestHash, accountUpdateHash, feePayerHash, createFeePayer, accountUpdateFromFeePayer, };
};
//# sourceMappingURL=sign-zkapp-command.js.map