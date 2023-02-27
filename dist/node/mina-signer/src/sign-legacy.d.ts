import { UInt32, UInt64 } from '../../provable/field-bigint.js';
import { PublicKey } from '../../provable/curve-bigint.js';
import { NetworkId, SignatureJson } from './signature.js';
import { Json } from '../../provable/gen/transaction-bigint.js';
export { signPayment, signStakeDelegation, signString, verifyPayment, verifyStakeDelegation, verifyStringSignature, paymentFromJson, delegationFromJson, commonFromJson, PaymentJson, DelegationJson, CommonJson, Tag, UserCommand, UserCommandEnum, BodyEnum, Payment, Delegation, Common, };
declare function signPayment(payment: PaymentJson, privateKeyBase58: string, networkId: NetworkId): SignatureJson;
declare function signStakeDelegation(delegation: DelegationJson, privateKeyBase58: string, networkId: NetworkId): SignatureJson;
declare function verifyPayment(payment: PaymentJson, signatureJson: SignatureJson, publicKeyBase58: string, networkId: NetworkId): boolean;
declare function verifyStakeDelegation(delegation: DelegationJson, signatureJson: SignatureJson, publicKeyBase58: string, networkId: NetworkId): boolean;
declare function paymentFromJson({ common, body: { source, receiver, amount }, }: PaymentJson): UserCommand;
declare function delegationFromJson({ common, body: { delegator, newDelegate }, }: DelegationJson): UserCommand;
declare function commonFromJson(c: CommonJson): {
    fee: bigint;
    feePayer: PublicKey;
    nonce: bigint;
    validUntil: bigint;
    memo: string;
};
declare function signString(string: string, privateKeyBase58: string, networkId: NetworkId): SignatureJson;
declare function verifyStringSignature(string: string, signatureJson: SignatureJson, publicKeyBase58: string, networkId: NetworkId): boolean;
declare type Tag = 'Payment' | 'StakeDelegation';
declare type UserCommand = {
    common: Common;
    body: {
        tag: Tag;
        source: PublicKey;
        receiver: PublicKey;
        amount: UInt64;
    };
};
declare type UserCommandEnum = {
    common: Common;
    body: BodyEnum;
};
declare type BodyEnum = {
    type: 'Payment';
    value: Payment;
} | {
    type: 'StakeDelegation';
    value: {
        type: 'SetDelegate';
        value: Delegation;
    };
};
declare type Common = {
    fee: UInt64;
    feePayer: PublicKey;
    nonce: UInt32;
    validUntil: UInt32;
    memo: string;
};
declare type Payment = {
    source: PublicKey;
    receiver: PublicKey;
    amount: UInt64;
};
declare type Delegation = {
    delegator: PublicKey;
    newDelegate: PublicKey;
};
declare type CommonJson = {
    fee: Json.UInt64;
    feePayer: Json.PublicKey;
    nonce: Json.UInt32;
    validUntil: Json.UInt32;
    memo: string;
};
declare type PaymentJson = {
    common: CommonJson;
    body: {
        source: Json.PublicKey;
        receiver: Json.PublicKey;
        amount: Json.UInt64;
    };
};
declare type DelegationJson = {
    common: CommonJson;
    body: {
        delegator: Json.PublicKey;
        newDelegate: Json.PublicKey;
    };
};
