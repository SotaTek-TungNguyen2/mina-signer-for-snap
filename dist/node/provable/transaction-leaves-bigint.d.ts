import { Field, Bool, UInt32, UInt64, Sign } from './field-bigint.js';
import { PublicKey } from './curve-bigint.js';
export { PublicKey, Field, Bool, AuthRequired, AuthorizationKind, UInt64, UInt32, Sign, TokenId, };
export { Events, SequenceEvents, ZkappUri, TokenSymbol, SequenceState };
declare type AuthRequired = {
    constant: Bool;
    signatureNecessary: Bool;
    signatureSufficient: Bool;
};
declare type AuthorizationKind = {
    isSigned: Bool;
    isProved: Bool;
};
declare type TokenId = Field;
declare type TokenSymbol = {
    symbol: string;
    field: Field;
};
declare type ZkappUri = {
    data: string;
    hash: Field;
};
declare const TokenId: {
    emptyValue(): bigint;
    toJSON(x: bigint): string;
    fromJSON(x: string): bigint;
    toFields: (x: bigint) => bigint[];
    toAuxiliary: (x?: bigint | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => bigint;
    sizeInFields(): number;
    check: (x: bigint) => void;
    toInput: (x: bigint) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
}, TokenSymbol: {
    toInput({ field }: {
        symbol: string;
        field: bigint;
    }): import("./generic.js").GenericHashInput<bigint>;
    toJSON({ symbol }: {
        symbol: string;
        field: bigint;
    }): string;
    fromJSON(symbol: string): {
        symbol: string;
        field: bigint;
    };
    toFields: (x: {
        field: bigint;
        symbol: string;
    }) => bigint[];
    toAuxiliary: (x?: {
        field: bigint;
        symbol: string;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        field: bigint;
        symbol: string;
    };
    sizeInFields(): number;
    check: (x: {
        field: bigint;
        symbol: string;
    }) => void;
    emptyValue?: (() => {
        field: bigint;
        symbol: string;
    }) | undefined;
}, AuthRequired: {
    emptyValue(): {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    };
    toJSON(x: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    }): import("./transaction-leaves-json.js").AuthRequired;
    fromJSON(json: import("./transaction-leaves-json.js").AuthRequired): {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    };
    toFields: (x: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    }) => bigint[];
    toAuxiliary: (x?: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    };
    sizeInFields(): number;
    check: (x: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    }) => void;
    toInput: (x: {
        constant: Bool;
        signatureNecessary: Bool;
        signatureSufficient: Bool;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
}, AuthorizationKind: {
    toJSON(x: {
        isSigned: Bool;
        isProved: Bool;
    }): import("./transaction-leaves-json.js").AuthorizationKind;
    fromJSON(json: import("./transaction-leaves-json.js").AuthorizationKind): {
        isSigned: Bool;
        isProved: Bool;
    };
    toFields: (x: {
        isSigned: Bool;
        isProved: Bool;
    }) => bigint[];
    toAuxiliary: (x?: {
        isSigned: Bool;
        isProved: Bool;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        isSigned: Bool;
        isProved: Bool;
    };
    sizeInFields(): number;
    check: (x: {
        isSigned: Bool;
        isProved: Bool;
    }) => void;
    toInput: (x: {
        isSigned: Bool;
        isProved: Bool;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    emptyValue?: (() => {
        isSigned: Bool;
        isProved: Bool;
    }) | undefined;
}, ZkappUri: import("./generic.js").GenericProvable<{
    data: string;
    hash: bigint;
}, bigint> & {
    toInput: (x: {
        data: string;
        hash: bigint;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: {
        data: string;
        hash: bigint;
    }) => string;
    fromJSON: (x: string) => {
        data: string;
        hash: bigint;
    };
    emptyValue?: (() => {
        data: string;
        hash: bigint;
    }) | undefined;
} & {
    emptyValue(): {
        data: string;
        hash: bigint;
    };
};
declare type Event = Field[];
declare type Events = {
    hash: Field;
    data: Event[];
};
declare type SequenceEvents = Events;
declare const Events: {
    toFields: (x: {
        data: bigint[][];
        hash: bigint;
    }) => bigint[];
    toAuxiliary: (x?: {
        data: bigint[][];
        hash: bigint;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        data: bigint[][];
        hash: bigint;
    };
    sizeInFields(): number;
    check: (x: {
        data: bigint[][];
        hash: bigint;
    }) => void;
    toInput: (x: {
        data: bigint[][];
        hash: bigint;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: {
        data: bigint[][];
        hash: bigint;
    }) => string[][];
    fromJSON: (x: string[][]) => {
        data: bigint[][];
        hash: bigint;
    };
    emptyValue: (() => {
        data: bigint[][];
        hash: bigint;
    }) & (() => {
        data: bigint[][];
        hash: bigint;
    });
    empty(): {
        hash: bigint;
        data: bigint[][];
    };
    pushEvent(events: {
        hash: bigint;
        data: bigint[][];
    }, event: bigint[]): {
        hash: bigint;
        data: bigint[][];
    };
    hash(events: bigint[][]): bigint;
}, SequenceEvents: {
    toFields: (x: {
        data: bigint[][];
        hash: bigint;
    }) => bigint[];
    toAuxiliary: (x?: {
        data: bigint[][];
        hash: bigint;
    } | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => {
        data: bigint[][];
        hash: bigint;
    };
    sizeInFields(): number;
    check: (x: {
        data: bigint[][];
        hash: bigint;
    }) => void;
    toInput: (x: {
        data: bigint[][];
        hash: bigint;
    }) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: {
        data: bigint[][];
        hash: bigint;
    }) => string[][];
    fromJSON: (x: string[][]) => {
        data: bigint[][];
        hash: bigint;
    };
    emptyValue: (() => {
        data: bigint[][];
        hash: bigint;
    }) & (() => {
        data: bigint[][];
        hash: bigint;
    });
    empty(): {
        hash: bigint;
        data: bigint[][];
    };
    pushEvent(sequenceEvents: {
        hash: bigint;
        data: bigint[][];
    }, event: bigint[]): {
        hash: bigint;
        data: bigint[][];
    };
    hash(events: bigint[][]): bigint;
    emptySequenceState(): bigint;
    updateSequenceState(state: bigint, sequenceEventsHash: bigint): bigint;
};
declare type SequenceState = Field;
declare const SequenceState: {
    emptyValue: () => bigint;
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
    toBytes(t: bigint): number[];
    readBytes(bytes: number[], offset: number): [value: bigint, offset: number];
    fromBytes(bytes: number[]): bigint;
    toBits(t: bigint): boolean[];
    fromBits(bits: boolean[]): bigint;
    sizeInBytes(): number;
    toFields: (x: bigint) => bigint[];
    toAuxiliary: (x?: bigint | undefined) => any[];
    fromFields: (x: bigint[], aux: any[]) => bigint;
    sizeInFields(): number;
    check: (x: bigint) => void;
    toInput: (x: bigint) => {
        fields?: bigint[] | undefined;
        packed?: [bigint, number][] | undefined;
    };
    toJSON: (x: bigint) => string;
    fromJSON: (x: string) => bigint;
};
