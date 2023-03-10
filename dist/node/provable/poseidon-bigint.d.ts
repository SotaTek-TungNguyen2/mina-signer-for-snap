import { Field } from './field-bigint.js';
import { Poseidon } from '../js_crypto/poseidon.js';
import { prefixes } from '../js_crypto/constants.js';
import { GenericHashInput } from './generic.js';
export { Poseidon, Hash, HashInput, prefixes, packToFields, hashWithPrefix, packToFieldsLegacy, HashInputLegacy, inputToBitsLegacy, HashLegacy, };
declare type HashInput = GenericHashInput<Field>;
declare const HashInput: {
    readonly empty: {};
    append(input1: GenericHashInput<bigint>, input2: GenericHashInput<bigint>): GenericHashInput<bigint>;
};
declare const Hash: {
    salt: (prefix: string) => bigint[];
    emptyHashWithPrefix: (prefix: string) => bigint;
    hashWithPrefix: (prefix: string, input: bigint[]) => bigint;
};
declare let hashWithPrefix: (prefix: string, input: bigint[]) => bigint;
declare const HashLegacy: {
    salt: (prefix: string) => bigint[];
    emptyHashWithPrefix: (prefix: string) => bigint;
    hashWithPrefix: (prefix: string, input: bigint[]) => bigint;
};
/**
 * Convert the {fields, packed} hash input representation to a list of field elements
 * Random_oracle_input.Chunked.pack_to_fields
 */
declare function packToFields({ fields, packed }: HashInput): bigint[];
/**
 * Random_oracle_input.Legacy.pack_to_fields
 */
declare function packToFieldsLegacy({ fields, bits }: HashInputLegacy): bigint[];
declare function inputToBitsLegacy({ fields, bits }: HashInputLegacy): boolean[];
declare type HashInputLegacy = {
    fields: Field[];
    bits: boolean[];
};
declare const HashInputLegacy: {
    empty(): HashInputLegacy;
    bits(bits: boolean[]): HashInputLegacy;
    append(input1: HashInputLegacy, input2: HashInputLegacy): HashInputLegacy;
};
