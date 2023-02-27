function hasCommonProperties(data) {
    return (data.hasOwnProperty('to') &&
        data.hasOwnProperty('from') &&
        data.hasOwnProperty('fee') &&
        data.hasOwnProperty('nonce'));
}
function isZkappCommand(p) {
    return p.hasOwnProperty('zkappCommand') && p.hasOwnProperty('feePayer');
}
function isPayment(p) {
    return hasCommonProperties(p) && p.hasOwnProperty('amount');
}
function isStakeDelegation(p) {
    return hasCommonProperties(p) && !p.hasOwnProperty('amount');
}
function isMessage(p) {
    return p.hasOwnProperty('publicKey') && p.hasOwnProperty('message');
}

module.exports = { isZkappCommand, isPayment, isStakeDelegation, isMessage };
//# sourceMappingURL=Utils.js.map