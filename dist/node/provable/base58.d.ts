import { Binable } from './binable.js';
export { toBase58Check, fromBase58Check, base58, withBase58, fieldEncodings, Base58, };
declare function toBase58Check(input: number[] | Uint8Array, versionByte: number): string;
declare function fromBase58Check(base58: string, versionByte: number): number[];
declare type Base58<T> = {
    toBase58(t: T): string;
    fromBase58(base58: string): T;
};
declare function base58<T>(binable: Binable<T>, versionByte: number): Base58<T>;
declare function withBase58<T>(binable: Binable<T>, versionByte: number): Binable<T> & Base58<T>;
declare function fieldEncodings<Field>(Field: Binable<Field>): {
    TokenId: Base58<Field>;
    ReceiptChainHash: Base58<Field>;
    LedgerHash: Base58<Field>;
    EpochSeed: Base58<Field>;
    StateHash: Base58<Field>;
};
