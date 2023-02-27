export { Fp, Fq, FiniteField, p, q, mod, inverse };
declare const p = 28948022309329048855892746252171976963363056481941560715954676764349967630337n;
declare const q = 28948022309329048855892746252171976963363056481941647379679742748393362948097n;
declare function mod(x: bigint, p: bigint): bigint;
declare function inverse(a: bigint, p: bigint): bigint | undefined;
declare const Fp: {
    modulus: bigint;
    sizeInBits: number;
    t: bigint;
    twoadicRoot: bigint;
    add(x: bigint, y: bigint): bigint;
    negate(x: bigint): bigint;
    sub(x: bigint, y: bigint): bigint;
    mul(x: bigint, y: bigint): bigint;
    inverse(x: bigint): bigint | undefined;
    div(x: bigint, y: bigint): bigint | undefined;
    square(x: bigint): bigint;
    isSquare(x: bigint): boolean;
    sqrt(x: bigint): bigint | undefined;
    power(x: bigint, n: bigint): bigint;
    dot(x: bigint[], y: bigint[]): bigint;
    equal(x: bigint, y: bigint): boolean;
    isEven(x: bigint): boolean;
    random(): bigint;
    fromNumber(x: number): bigint;
    fromBigint(x: bigint): bigint;
};
declare const Fq: {
    modulus: bigint;
    sizeInBits: number;
    t: bigint;
    twoadicRoot: bigint;
    add(x: bigint, y: bigint): bigint;
    negate(x: bigint): bigint;
    sub(x: bigint, y: bigint): bigint;
    mul(x: bigint, y: bigint): bigint;
    inverse(x: bigint): bigint | undefined;
    div(x: bigint, y: bigint): bigint | undefined;
    square(x: bigint): bigint;
    isSquare(x: bigint): boolean;
    sqrt(x: bigint): bigint | undefined;
    power(x: bigint, n: bigint): bigint;
    dot(x: bigint[], y: bigint[]): bigint;
    equal(x: bigint, y: bigint): boolean;
    isEven(x: bigint): boolean;
    random(): bigint;
    fromNumber(x: number): bigint;
    fromBigint(x: bigint): bigint;
};
declare type FiniteField = ReturnType<typeof createField>;
declare function createField(p: bigint, t: bigint, twoadicRoot: bigint): {
    modulus: bigint;
    sizeInBits: number;
    t: bigint;
    twoadicRoot: bigint;
    add(x: bigint, y: bigint): bigint;
    negate(x: bigint): bigint;
    sub(x: bigint, y: bigint): bigint;
    mul(x: bigint, y: bigint): bigint;
    inverse(x: bigint): bigint | undefined;
    div(x: bigint, y: bigint): bigint | undefined;
    square(x: bigint): bigint;
    isSquare(x: bigint): boolean;
    sqrt(x: bigint): bigint | undefined;
    power(x: bigint, n: bigint): bigint;
    dot(x: bigint[], y: bigint[]): bigint;
    equal(x: bigint, y: bigint): boolean;
    isEven(x: bigint): boolean;
    random(): bigint;
    fromNumber(x: number): bigint;
    fromBigint(x: bigint): bigint;
};