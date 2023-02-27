import { ZkappCommand as ZkappCommandJson } from '../../provable/gen/transaction-json.js';
export declare type UInt32 = number | bigint | string;
export declare type UInt64 = number | bigint | string;
export declare type PublicKey = string;
export declare type PrivateKey = string;
export declare type Network = 'mainnet' | 'testnet';
export declare type Keypair = {
    readonly privateKey: PrivateKey;
    readonly publicKey: PublicKey;
};
export declare type Message = {
    publicKey: PublicKey;
    message: string;
};
export declare type Signature = {
    readonly field: string;
    readonly scalar: string;
    readonly signer: string;
};
export declare type Common = {
    readonly to: PublicKey;
    readonly from: PublicKey;
    readonly fee: UInt64;
    readonly nonce: UInt32;
    readonly memo?: string;
    readonly validUntil?: UInt32;
};
export declare type StrictCommon = {
    readonly to: string;
    readonly from: string;
    readonly fee: string;
    readonly nonce: string;
    readonly memo: string;
    readonly validUntil: string;
};
export declare type StakeDelegation = Common;
export declare type Payment = Common & {
    readonly amount: UInt64;
};
export declare type ZkappCommand = {
    readonly zkappCommand: ZkappCommandJson;
    readonly feePayer: {
        readonly feePayer: PublicKey;
        readonly fee: UInt64;
        readonly nonce: UInt32;
        readonly memo?: string;
        readonly validUntil?: UInt32;
    };
};
export declare type SignableData = Message | StakeDelegation | Payment | ZkappCommand;
export declare type Signed<SignableData> = {
    readonly signature: Signature;
    readonly data: SignableData;
};
