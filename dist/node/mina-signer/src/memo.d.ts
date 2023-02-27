export { Memo };
declare function fromString(memo: string): string;
declare function hash(memo: string): bigint;
declare const Memo: {
    sizeInBytes(): number;
    emptyValue(): string;
    toBase58(t: string): string;
    fromBase58(base58: string): string;
    toBytes(t: string): number[];
    readBytes(bytes: number[], offset: number): [value: string, offset: number];
    fromBytes(bytes: number[]): string;
    toBits(t: string): boolean[];
    fromBits(bits: boolean[]): string;
    sizeInBits(): number;
    fromString: typeof fromString;
    hash: typeof hash;
};
