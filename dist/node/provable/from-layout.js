const { primitiveTypeMap, primitiveTypes } = require('./generic.js'); // import { primitiveTypeMap, primitiveTypes, } from './generic.js';
function ProvableFromLayout(TypeMap, customTypes) {
    const Field = TypeMap.Field;
    const PrimitiveMap = primitiveTypeMap();
    function provableFromLayout(typeData) {
        return {
            sizeInFields() {
                return sizeInFields(typeData);
            },
            toFields(value) {
                return toFields(typeData, value);
            },
            toAuxiliary(value) {
                return toAuxiliary(typeData, value);
            },
            fromFields(fields, aux) {
                return fromFields(typeData, fields, aux);
            },
            toJSON(value) {
                return toJSON(typeData, value);
            },
            fromJSON(json) {
                return fromJSON(typeData, json);
            },
            check(value) {
                check(typeData, value);
            },
            toInput(value) {
                return toInput(typeData, value);
            },
            emptyValue() {
                return emptyValue(typeData);
            },
        };
    }
    function toJSON(typeData, value) {
        return layoutFold({
            map(type, value) {
                return type.toJSON(value);
            },
            reduceArray(array) {
                return array;
            },
            reduceObject(_, object) {
                return object;
            },
            reduceFlaggedOption({ isSome, value }) {
                return isSome ? value : null;
            },
            reduceOrUndefined(value) {
                return value ?? null;
            },
        }, typeData, value);
    }
    function fromJSON(typeData, json) {
        let { checkedTypeName } = typeData;
        if (checkedTypeName) {
            // there's a custom type!
            return customTypes[checkedTypeName].fromJSON(json);
        }
        if (typeData.type === 'array') {
            let arrayTypeData = typeData;
            return json.map((json) => fromJSON(arrayTypeData.inner, json));
        }
        if (typeData.type === 'option') {
            let optionTypeData = typeData;
            switch (optionTypeData.optionType) {
                case 'closedInterval':
                case 'flaggedOption': {
                    let isSome = TypeMap.Bool.fromJSON(json !== null);
                    let value;
                    if (json !== null) {
                        value = fromJSON(optionTypeData.inner, json);
                    }
                    else {
                        value = emptyValue(optionTypeData.inner);
                        if (optionTypeData.optionType === 'closedInterval') {
                            let innerInner = optionTypeData.inner.entries.lower;
                            let innerType = TypeMap[innerInner.type];
                            value.lower = innerType.fromJSON(optionTypeData.rangeMin);
                            value.upper = innerType.fromJSON(optionTypeData.rangeMax);
                        }
                    }
                    return { isSome, value };
                }
                case 'orUndefined': {
                    return json === null
                        ? undefined
                        : fromJSON(optionTypeData.inner, json);
                }
                default:
                    throw Error('bug');
            }
        }
        if (typeData.type === 'object') {
            let { keys, entries } = typeData;
            let values = {};
            for (let i = 0; i < keys.length; i++) {
                let typeEntry = entries[keys[i]];
                values[keys[i]] = fromJSON(typeEntry, json[keys[i]]);
            }
            return values;
        }
        if (primitiveTypes.has(typeData.type)) {
            return PrimitiveMap[typeData.type].fromJSON(json);
        }
        return TypeMap[typeData.type].fromJSON(json);
    }
    function toFields(typeData, value) {
        return layoutFold({
            map(type, value) {
                return type.toFields(value);
            },
            reduceArray(array) {
                return array.flat();
            },
            reduceObject(keys, object) {
                return keys.map((key) => object[key]).flat();
            },
            reduceFlaggedOption({ isSome, value }) {
                return [isSome, value].flat();
            },
            reduceOrUndefined(_) {
                return [];
            },
        }, typeData, value);
    }
    function toAuxiliary(typeData, value) {
        return layoutFold({
            map(type, value) {
                return type.toAuxiliary(value);
            },
            reduceArray(array) {
                return array;
            },
            reduceObject(keys, object) {
                return keys.map((key) => object[key]);
            },
            reduceFlaggedOption({ value }) {
                return value;
            },
            reduceOrUndefined(value) {
                return value === undefined ? [false] : [true, value];
            },
        }, typeData, value);
    }
    function sizeInFields(typeData) {
        let spec = {
            map(type) {
                return type.sizeInFields();
            },
            reduceArray(_, { inner, staticLength }) {
                let length = staticLength ?? NaN;
                return length * layoutFold(spec, inner);
            },
            reduceObject(keys, object) {
                return keys.map((key) => object[key]).reduce((x, y) => x + y);
            },
            reduceFlaggedOption({ isSome, value }) {
                return isSome + value;
            },
            reduceOrUndefined(_) {
                return 0;
            },
        };
        return layoutFold(spec, typeData);
    }
    function fromFields(typeData, fields, aux) {
        let { checkedTypeName } = typeData;
        if (checkedTypeName) {
            // there's a custom type!
            return customTypes[checkedTypeName].fromFields(fields, aux);
        }
        if (typeData.type === 'array') {
            let arrayTypeData = typeData;
            let size = sizeInFields(arrayTypeData.inner);
            let length = aux.length;
            let value = [];
            for (let i = 0, offset = 0; i < length; i++, offset += size) {
                value[i] = fromFields(arrayTypeData.inner, fields.slice(offset, offset + size), aux[i]);
            }
            return value;
        }
        if (typeData.type === 'option') {
            let { optionType, inner } = typeData;
            switch (optionType) {
                case 'closedInterval':
                case 'flaggedOption': {
                    let [first, ...rest] = fields;
                    let isSome = TypeMap.Bool.fromFields([first], []);
                    let value = fromFields(inner, rest, aux);
                    return { isSome, value };
                }
                case 'orUndefined': {
                    let [isDefined, value] = aux;
                    return isDefined ? fromFields(inner, fields, value) : undefined;
                }
                default:
                    throw Error('bug');
            }
        }
        if (typeData.type === 'object') {
            let { keys, entries } = typeData;
            let values = {};
            let offset = 0;
            for (let i = 0; i < keys.length; i++) {
                let typeEntry = entries[keys[i]];
                let size = sizeInFields(typeEntry);
                values[keys[i]] = fromFields(typeEntry, fields.slice(offset, offset + size), aux[i]);
                offset += size;
            }
            return values;
        }
        if (primitiveTypes.has(typeData.type)) {
            return PrimitiveMap[typeData.type].fromFields(fields, aux);
        }
        return TypeMap[typeData.type].fromFields(fields, aux);
    }
    function emptyValue(typeData) {
        let { checkedTypeName } = typeData;
        if (checkedTypeName) {
            return emptyValueBase(typeData);
        }
        if (typeData.type === 'array') {
            let arrayTypeData = typeData;
            let { inner, staticLength } = arrayTypeData;
            if (staticLength == null)
                return [];
            return Array(staticLength).fill(emptyValue(inner));
        }
        if (typeData.type === 'option') {
            let optionTypeData = typeData;
            switch (optionTypeData.optionType) {
                case 'closedInterval':
                case 'flaggedOption': {
                    let isSome = TypeMap.Bool.fromJSON(false);
                    let value = emptyValue(optionTypeData.inner);
                    if (optionTypeData.optionType === 'closedInterval') {
                        let innerInner = optionTypeData.inner.entries.lower;
                        let innerType = TypeMap[innerInner.type];
                        value.lower = innerType.fromJSON(optionTypeData.rangeMin);
                        value.upper = innerType.fromJSON(optionTypeData.rangeMax);
                    }
                    return { isSome, value };
                }
                case 'orUndefined': {
                    return undefined;
                }
                default:
                    throw Error('bug');
            }
        }
        if (typeData.type === 'object') {
            let { keys, entries } = typeData;
            let values = {};
            for (let i = 0; i < keys.length; i++) {
                let typeEntry = entries[keys[i]];
                values[keys[i]] = emptyValue(typeEntry);
            }
            return values;
        }
        return emptyValueBase(typeData);
    }
    function emptyValueBase(typeData) {
        let { checkedTypeName } = typeData;
        if (checkedTypeName) {
            let checkedType = customTypes[checkedTypeName];
            if (checkedType.emptyValue)
                return checkedType.emptyValue();
        }
        let typeName = typeData.type;
        if (TypeMap[typeName]) {
            let type = TypeMap[typeName];
            if (type.emptyValue)
                return type.emptyValue();
        }
        let zero = Field.fromJSON('0');
        let fields = Array(sizeInFields(typeData)).fill(zero);
        return fromFields(typeData, fields, toAuxiliary(typeData));
    }
    function check(typeData, value) {
        return layoutFold({
            map(type, value) {
                return type.check(value);
            },
            reduceArray() { },
            reduceObject() { },
            reduceFlaggedOption() { },
            reduceOrUndefined() { },
        }, typeData, value);
    }
    function toInput(typeData, value) {
        return layoutFold({
            map(type, value) {
                return type.toInput(value);
            },
            reduceArray(array) {
                let acc = { fields: [], packed: [] };
                for (let { fields, packed } of array) {
                    if (fields)
                        acc.fields.push(...fields);
                    if (packed)
                        acc.packed.push(...packed);
                }
                return acc;
            },
            reduceObject(keys, object) {
                let acc = { fields: [], packed: [] };
                for (let key of keys) {
                    let { fields, packed } = object[key];
                    if (fields)
                        acc.fields.push(...fields);
                    if (packed)
                        acc.packed.push(...packed);
                }
                return acc;
            },
            reduceFlaggedOption({ isSome, value }) {
                return {
                    fields: value.fields,
                    packed: isSome.packed.concat(value.packed ?? []),
                };
            },
            reduceOrUndefined(_) {
                return {};
            },
        }, typeData, value);
    }
    function layoutFold(spec, typeData, value) {
        let { checkedTypeName } = typeData;
        if (checkedTypeName) {
            // there's a custom type!
            return spec.map(customTypes[checkedTypeName], value);
        }
        if (typeData.type === 'array') {
            let arrayTypeData = typeData;
            let v = value;
            if (arrayTypeData.staticLength != null && v === undefined) {
                v = Array(arrayTypeData.staticLength).fill(undefined);
            }
            let array = v?.map((x) => layoutFold(spec, arrayTypeData.inner, x)) ?? [];
            return spec.reduceArray(array, arrayTypeData);
        }
        if (typeData.type === 'option') {
            let { optionType, inner } = typeData;
            switch (optionType) {
                case 'closedInterval':
                case 'flaggedOption':
                    let v = value;
                    return spec.reduceFlaggedOption({
                        isSome: spec.map(TypeMap.Bool, v?.isSome),
                        value: layoutFold(spec, inner, v?.value),
                    });
                case 'orUndefined':
                    let mapped = value === undefined ? undefined : layoutFold(spec, inner, value);
                    return spec.reduceOrUndefined(mapped);
                default:
                    throw Error('bug');
            }
        }
        if (typeData.type === 'object') {
            let { keys, entries } = typeData;
            let v = value;
            let object = {};
            keys.forEach((key) => {
                object[key] = layoutFold(spec, entries[key], v?.[key]);
            });
            return spec.reduceObject(keys, object);
        }
        if (primitiveTypes.has(typeData.type)) {
            return spec.map(PrimitiveMap[typeData.type], value);
        }
        return spec.map(TypeMap[typeData.type], value);
    }
    // helper for pretty-printing / debugging
    function toJSONEssential(typeData, value) {
        return layoutFold({
            map(type, value) {
                return type.toJSON(value);
            },
            reduceArray(array) {
                if (array.length === 0 || array.every((x) => x === null))
                    return null;
                return array;
            },
            reduceObject(_, object) {
                for (let key in object) {
                    if (object[key] === null) {
                        delete object[key];
                    }
                }
                if (Object.keys(object).length === 0)
                    return null;
                return object;
            },
            reduceFlaggedOption({ isSome, value }) {
                return isSome ? value : null;
            },
            reduceOrUndefined(value) {
                return value ?? null;
            },
        }, typeData, value);
    }
    return { provableFromLayout, toJSONEssential };
}
module.exports = { ProvableFromLayout }; // export { ProvableFromLayout };
//# sourceMappingURL=from-layout.js.map