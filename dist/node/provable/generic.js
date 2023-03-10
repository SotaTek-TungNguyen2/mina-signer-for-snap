let emptyType = {
    sizeInFields: () => 0,
    toFields: () => [],
    toAuxiliary: () => [],
    fromFields: () => null,
    check: () => { },
    toInput: () => ({}),
    toJSON: () => null,
    fromJSON: () => null,
};
let primitiveTypes = new Set(['number', 'string', 'null']);
function primitiveTypeMap() {
    return {
        number: {
            ...emptyType,
            toAuxiliary: (value = 0) => [value],
            toJSON: (value) => value,
            fromJSON: (value) => value,
            fromFields: (_, [value]) => value,
        },
        string: {
            ...emptyType,
            toAuxiliary: (value = '') => [value],
            toJSON: (value) => value,
            fromJSON: (value) => value,
            fromFields: (_, [value]) => value,
        },
        null: emptyType,
    };
}
module.exports = { primitiveTypes, primitiveTypeMap }; // export { primitiveTypes, primitiveTypeMap, };
//# sourceMappingURL=generic.js.map