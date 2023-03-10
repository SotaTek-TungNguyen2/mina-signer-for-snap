import { Field } from '../../provable/field-bigint.js';
import { Json, AccountUpdate, ZkappCommand } from '../../provable/gen/transaction-bigint.js';
import { NetworkId } from './signature.js';
export { signZkappCommand, verifyZkappCommandSignature };
export { accountUpdatesToCallForest, callForestHash, accountUpdateHash, feePayerHash, createFeePayer, accountUpdateFromFeePayer, };
declare function signZkappCommand(zkappCommand_: Json.ZkappCommand, privateKeyBase58: string, networkId: NetworkId): Json.ZkappCommand;
declare function verifyZkappCommandSignature(zkappCommand_: Json.ZkappCommand, publicKeyBase58: string, networkId: NetworkId): boolean;
declare type CallTree = {
    accountUpdate: AccountUpdate;
    children: CallForest;
};
declare type CallForest = CallTree[];
/**
 * Turn flat list into a hierarchical structure (forest) by letting the callDepth
 * determine parent-child relationships
 */
declare function accountUpdatesToCallForest(updates: AccountUpdate[], callDepth?: number): CallForest;
declare function accountUpdateHash(update: AccountUpdate): bigint;
declare function callForestHash(forest: CallForest): Field;
declare type FeePayer = ZkappCommand['feePayer'];
declare function createFeePayer(feePayer: FeePayer['body']): FeePayer;
declare function feePayerHash(feePayer: FeePayer): bigint;
declare function accountUpdateFromFeePayer({ body: { fee, nonce, publicKey, validUntil }, authorization: signature, }: FeePayer): AccountUpdate;
