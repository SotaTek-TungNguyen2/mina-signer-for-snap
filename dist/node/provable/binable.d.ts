import { GenericField } from './generic.js';
export { Binable, defineBinable, withVersionNumber, tuple, record, enumWithArgument, prefixToField, bytesToBits, bitsToBytes, withBits, withCheck, BinableWithBits, stringToBytes, BinableString, BinableBigintInteger, };
declare type Binable<T> = {
    toBytes(t: T): number[];
    readBytes(bytes: number[], offset: number): [value: T, offset: number];
    fromBytes(bytes: number[]): T;
};
declare type BinableWithBits<T> = Binable<T> & {
    toBits(t: T): boolean[];
    fromBits(bits: boolean[]): T;
    sizeInBytes(): number;
    sizeInBits(): number;
};
declare function defineBinable<T>({ toBytes, readBytes, }: {
    toBytes(t: T): number[];
    readBytes(bytes: number[], offset: number): [value: T, offset: number];
}): Binable<T>;
declare function withVersionNumber<T>(binable: Binable<T>, versionNumber?: number): Binable<T>;
declare function withCheck<T>({ toBytes, readBytes }: Binable<T>, check: (t: T) => void): Binable<T>;
declare type Tuple<T> = [T, ...T[]] | [];
declare function record<Types extends Record<string, any>>(binables: {
    [i in keyof Types]: Binable<Types[i]>;
}, keys: Tuple<keyof Types>): Binable<Types>;
declare function tuple<Types extends Tuple<any>>(binables: {
    [i in keyof Types]: Binable<Types[i]>;
}): Binable<Types>;
declare type EnumNoArgument<T extends string> = {
    type: T;
};
declare type EnumWithArgument<T extends string, V> = {
    type: T;
    value: V;
};
declare type AnyEnum = EnumNoArgument<string> | EnumWithArgument<string, any>;
declare function enumWithArgument<Enum_ extends Tuple<AnyEnum>>(types: {
    [i in keyof Enum_]: Enum_[i] extends EnumWithArgument<string, any> ? {
        type: Enum_[i]['type'];
        value: Binable<Enum_[i]['value']>;
    } : {
        type: Enum_[i]['type'];
    };
}): Binable<Enum_[number]>;
declare const BinableString: Binable<string>;
declare const BinableBigintInteger: Binable<bigint>;
declare function prefixToField<Field>(Field: GenericField<Field>, prefix: string): Field;
declare function bitsToBytes([...bits]: boolean[]): number[];
declare function bytesToBits(bytes: number[]): boolean[];
/**
 * This takes a `Binable<T>` plus an optional `sizeInBits`, and derives toBits() / fromBits() functions.
 * - `sizeInBits` has to observe `Math.ceil(sizeInBits / 8) === sizeInBytes`, so the bit size can be slightly smaller than the byte size
 * - If `sizeInBits` is `< sizeInBytes * 8`, then we assume that toBytes() returns a byte sequence where the bits
 *   higher than `sizeInBits` are all 0. This assumption manifests in toBits(), where we slice off those higher bits,
 *   to return a result that is of length `sizeInBits`.
 *
 * This is useful for serializing field elements, where -- depending on the circumstance -- we either want a
 * 32-byte (= 256-bit) serialization, or a 255-bit serialization
 */
declare function withBits<T>(binable: Binable<T>, sizeInBits: number): BinableWithBits<T>;
declare function stringToBytes(s: string): number[];
