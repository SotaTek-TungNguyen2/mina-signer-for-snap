import { Binable } from './binable.js';
export { GenericProvable, GenericProvablePure, GenericProvableExtended, GenericField, GenericBool, GenericHashInput, primitiveTypes, primitiveTypeMap, };
declare type GenericProvable<T, Field> = {
    toFields: (x: T) => Field[];
    toAuxiliary: (x?: T) => any[];
    fromFields: (x: Field[], aux: any[]) => T;
    sizeInFields(): number;
    check: (x: T) => void;
};
interface GenericProvablePure<T, Field> extends GenericProvable<T, Field> {
    toFields: (x: T) => Field[];
    toAuxiliary: (x?: T) => [];
    fromFields: (x: Field[]) => T;
    sizeInFields(): number;
    check: (x: T) => void;
}
declare type GenericProvableExtended<T, TJson, Field> = GenericProvable<T, Field> & {
    toInput: (x: T) => {
        fields?: Field[];
        packed?: [Field, number][];
    };
    toJSON: (x: T) => TJson;
    fromJSON: (x: TJson) => T;
    emptyValue?: () => T;
};
declare type GenericField<Field> = ((value: number | string | bigint) => Field) & GenericProvableExtended<Field, string, Field> & Binable<Field> & {
    sizeInBytes(): number;
};
declare type GenericBool<Field, Bool = unknown> = ((value: boolean) => Bool) & GenericProvableExtended<Bool, boolean, Field> & Binable<Bool> & {
    sizeInBytes(): number;
};
declare type GenericHashInput<Field> = {
    fields?: Field[];
    packed?: [Field, number][];
};
declare let primitiveTypes: Set<string>;
declare function primitiveTypeMap<Field>(): {
    number: GenericProvableExtended<number, number, Field>;
    string: GenericProvableExtended<string, string, Field>;
    null: GenericProvableExtended<null, null, Field>;
};
