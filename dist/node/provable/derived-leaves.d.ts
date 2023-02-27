import { GenericBool, GenericField, GenericHashInput } from './generic.js';
import * as Json from './gen/transaction-json.js';
import { HashHelpers } from '../lib/hash-generic.js';
export { derivedLeafTypes };
declare function derivedLeafTypes<Field, Bool>({ Field, Bool, Hash, packToFields, }: {
    Field: GenericField<Field>;
    Bool: GenericBool<Field, Bool>;
    Hash: HashHelpers<Field>;
    packToFields: (input: GenericHashInput<Field>) => Field[];
}): {
    TokenId: {
        emptyValue(): Field;
        toJSON(x: Field): string;
        fromJSON(x: string): Field;
        toFields: (x: Field) => Field[];
        toAuxiliary: (x?: Field | undefined) => any[];
        fromFields: (x: Field[], aux: any[]) => Field;
        sizeInFields(): number;
        check: (x: Field) => void;
        toInput: (x: Field) => {
            fields?: Field[] | undefined;
            packed?: [Field, number][] | undefined;
        };
    };
    TokenSymbol: {
        toInput({ field }: {
            symbol: string;
            field: Field;
        }): GenericHashInput<Field>;
        toJSON({ symbol }: {
            symbol: string;
            field: Field;
        }): string;
        fromJSON(symbol: string): {
            symbol: string;
            field: Field;
        };
        toFields: (x: {
            field: Field;
            symbol: string;
        }) => Field[];
        toAuxiliary: (x?: {
            field: Field;
            symbol: string;
        } | undefined) => any[];
        fromFields: (x: Field[], aux: any[]) => {
            field: Field;
            symbol: string;
        };
        sizeInFields(): number;
        check: (x: {
            field: Field;
            symbol: string;
        }) => void;
        emptyValue?: (() => {
            field: Field;
            symbol: string;
        }) | undefined;
    };
    AuthRequired: {
        emptyValue(): {
            constant: Bool;
            signatureNecessary: Bool;
            signatureSufficient: Bool;
        };
        toJSON(x: {
            constant: Bool;
            signatureNecessary: Bool;
            signatureSufficient: Bool;
        }): Json.AuthRequired;
        fromJSON(json: Json.AuthRequired): {
            constant: Bool;
            signatureNecessary: Bool;
            signatureSufficient: Bool;
        };
        toFields: (x: {
            constant: Bool;
            signatureNecessary: Bool;
            signatureSufficient: Bool;
        }) => Field[];
        toAuxiliary: (x?: {
            constant: Bool;
            signatureNecessary: Bool;
            signatureSufficient: Bool;
        } | undefined) => any[];
        fromFields: (x: Field[], aux: any[]) => {
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
            fields?: Field[] | undefined;
            packed?: [Field, number][] | undefined;
        };
    };
    AuthorizationKind: {
        toJSON(x: {
            isSigned: Bool;
            isProved: Bool;
        }): Json.AuthorizationKind;
        fromJSON(json: Json.AuthorizationKind): {
            isSigned: Bool;
            isProved: Bool;
        };
        toFields: (x: {
            isSigned: Bool;
            isProved: Bool;
        }) => Field[];
        toAuxiliary: (x?: {
            isSigned: Bool;
            isProved: Bool;
        } | undefined) => any[];
        fromFields: (x: Field[], aux: any[]) => {
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
            fields?: Field[] | undefined;
            packed?: [Field, number][] | undefined;
        };
        emptyValue?: (() => {
            isSigned: Bool;
            isProved: Bool;
        }) | undefined;
    };
    ZkappUri: import("./generic.js").GenericProvable<{
        data: string;
        hash: Field;
    }, Field> & {
        toInput: (x: {
            data: string;
            hash: Field;
        }) => {
            fields?: Field[] | undefined;
            packed?: [Field, number][] | undefined;
        };
        toJSON: (x: {
            data: string;
            hash: Field;
        }) => string;
        fromJSON: (x: string) => {
            data: string;
            hash: Field;
        };
        emptyValue?: (() => {
            data: string;
            hash: Field;
        }) | undefined;
    } & {
        emptyValue(): {
            data: string;
            hash: Field;
        };
    };
};
