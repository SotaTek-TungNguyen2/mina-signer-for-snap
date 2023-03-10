import { GenericHashInput, GenericProvable, GenericProvableExtended } from './generic.js';
export { createProvable, createHashInput, ProvableConstructor };
declare type ProvableConstructor<Field> = <A>(typeObj: A, options?: {
    customObjectKeys?: string[];
    isPure?: boolean;
}) => GenericProvableExtended<InferCircuitValue<A, Field>, InferJson<A>, Field>;
declare function createProvable<Field>(): ProvableConstructor<Field>;
declare function createHashInput<Field>(): {
    readonly empty: {};
    append(input1: GenericHashInput<Field>, input2: GenericHashInput<Field>): GenericHashInput<Field>;
};
declare type JSONValue = number | string | boolean | null | Array<JSONValue> | {
    [key: string]: JSONValue;
};
declare type Constructor<T> = new (...args: any) => T;
declare type Tuple<T> = [T, ...T[]] | [];
declare type Primitive = typeof String | typeof Number | typeof Boolean | typeof BigInt | null | undefined;
declare type InferPrimitive<P extends Primitive> = P extends typeof String ? string : P extends typeof Number ? number : P extends typeof Boolean ? boolean : P extends typeof BigInt ? bigint : P extends null ? null : P extends undefined ? undefined : any;
declare type InferPrimitiveJson<P extends Primitive> = P extends typeof String ? string : P extends typeof Number ? number : P extends typeof Boolean ? boolean : P extends typeof BigInt ? string : P extends null ? null : P extends undefined ? null : JSONValue;
declare type InferCircuitValue<A, Field> = A extends Constructor<infer U> ? A extends GenericProvable<U, Field> ? U : InferCircuitValueBase<A, Field> : InferCircuitValueBase<A, Field>;
declare type InferCircuitValueBase<A, Field> = A extends GenericProvable<infer U, Field> ? U : A extends Primitive ? InferPrimitive<A> : A extends Tuple<any> ? {
    [I in keyof A]: InferCircuitValue<A[I], Field>;
} : A extends (infer U)[] ? InferCircuitValue<U, Field>[] : A extends Record<any, any> ? {
    [K in keyof A]: InferCircuitValue<A[K], Field>;
} : never;
declare type WithJson<J> = {
    toJSON: (x: any) => J;
};
declare type InferJson<A> = A extends WithJson<infer J> ? J : A extends Primitive ? InferPrimitiveJson<A> : A extends Tuple<any> ? {
    [I in keyof A]: InferJson<A[I]>;
} : A extends WithJson<infer U>[] ? U[] : A extends Record<any, any> ? {
    [K in keyof A]: InferJson<A[K]>;
} : JSONValue;
