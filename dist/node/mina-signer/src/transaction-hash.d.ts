import { UInt64 } from '../../provable/field-bigint.js';
import { Binable } from '../../provable/binable.js';
import { Common, Delegation, Payment, UserCommand, UserCommandEnum, PaymentJson, DelegationJson } from './sign-legacy.js';
import { PublicKey } from '../../provable/curve-bigint.js';
import { Signature, SignatureJson } from './signature.js';
export { hashPayment, hashStakeDelegation, SignedCommand, SignedCommandV1, Common, userCommandToEnum, userCommandToV1, Signed, HashBase58, };
declare type Signed<T> = {
    data: T;
    signature: SignatureJson;
};
declare function hashPayment(signed: Signed<PaymentJson>, { berkeley }?: {
    berkeley?: boolean | undefined;
}): string;
declare function hashStakeDelegation(signed: Signed<DelegationJson>, { berkeley }?: {
    berkeley?: boolean | undefined;
}): string;
declare function userCommandToEnum({ common, body }: UserCommand): UserCommandEnum;
declare const Common: Binable<Common>;
declare const Payment: Binable<Payment>;
declare const Delegation: Binable<Delegation>;
declare type DelegationEnum = {
    type: 'SetDelegate';
    value: Delegation;
};
declare const DelegationEnum: Binable<DelegationEnum>;
declare const UserCommand: Binable<{
    common: Common;
    body: {
        type: 'Payment';
        value: Payment;
    } | {
        type: 'StakeDelegation';
        value: DelegationEnum;
    };
}>;
declare type SignedCommand = {
    payload: UserCommandEnum;
    signer: PublicKey;
    signature: Signature;
};
declare const SignedCommand: Binable<SignedCommand>;
declare const HashBase58: import("../../provable/base58.js").Base58<Uint8Array>;
declare function userCommandToV1({ common, body }: UserCommand): UserCommandV1;
declare type CommonV1 = Common & {
    feeToken: UInt64;
};
declare const CommonV1: Binable<CommonV1>;
declare type PaymentV1 = Payment & {
    tokenId: UInt64;
};
declare const PaymentV1: Binable<PaymentV1>;
declare type BodyV1 = {
    type: 'Payment';
    value: PaymentV1;
} | {
    type: 'StakeDelegation';
    value: DelegationEnum;
};
declare const BodyV1: Binable<{
    type: 'Payment';
    value: PaymentV1;
} | {
    type: 'StakeDelegation';
    value: DelegationEnum;
}>;
declare type UserCommandV1 = {
    common: CommonV1;
    body: BodyV1;
};
declare const UserCommandV1: Binable<UserCommandV1>;
declare type SignedCommandV1 = {
    payload: UserCommandV1;
    signer: PublicKey;
    signature: Signature;
};
declare const SignedCommandV1: Binable<SignedCommandV1> & import("../../provable/base58.js").Base58<SignedCommandV1>;
