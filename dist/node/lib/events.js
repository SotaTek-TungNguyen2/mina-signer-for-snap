const { prefixes } = require('../js_crypto/constants.js'); // import { prefixes } from '../js_crypto/constants.js';
const { prefixToField } = require('../provable/binable.js'); // import { prefixToField } from '../provable/binable.js';
function createEvents({ Field, Poseidon, }) {
    // hashing helpers
    function initialState() {
        return [Field(0), Field(0), Field(0)];
    }
    function salt(prefix) {
        return Poseidon.update(initialState(), [prefixToField(Field, prefix)]);
    }
    function hashWithPrefix(prefix, input) {
        let init = salt(prefix);
        return Poseidon.update(init, input)[0];
    }
    function emptyHashWithPrefix(prefix) {
        return salt(prefix)[0];
    }
    const Events = {
        empty() {
            let hash = emptyHashWithPrefix('MinaZkappEventsEmpty');
            return { hash, data: [] };
        },
        pushEvent(events, event) {
            let eventHash = hashWithPrefix(prefixes.event, event);
            let hash = hashWithPrefix(prefixes.events, [events.hash, eventHash]);
            return { hash, data: [event, ...events.data] };
        },
        hash(events) {
            return [...events].reverse().reduce(Events.pushEvent, Events.empty())
                .hash;
        },
    };
    const EventsProvable = {
        ...Events,
        ...dataAsHash({
            emptyValue: Events.empty,
            toJSON(data) {
                return data.map((row) => row.map((e) => Field.toJSON(e)));
            },
            fromJSON(json) {
                let data = json.map((row) => row.map((e) => Field.fromJSON(e)));
                let hash = Events.hash(data);
                return { data, hash };
            },
        }),
    };
    const SequenceEvents = {
        // same as events but w/ different hash prefixes
        empty() {
            let hash = emptyHashWithPrefix('MinaZkappSequenceEmpty');
            return { hash, data: [] };
        },
        pushEvent(sequenceEvents, event) {
            let eventHash = hashWithPrefix(prefixes.event, event);
            let hash = hashWithPrefix(prefixes.sequenceEvents, [
                sequenceEvents.hash,
                eventHash,
            ]);
            return { hash, data: [event, ...sequenceEvents.data] };
        },
        hash(events) {
            return [...events]
                .reverse()
                .reduce(SequenceEvents.pushEvent, SequenceEvents.empty()).hash;
        },
        // different than events
        emptySequenceState() {
            return emptyHashWithPrefix('MinaZkappSequenceStateEmptyElt');
        },
        updateSequenceState(state, sequenceEventsHash) {
            return hashWithPrefix(prefixes.sequenceEvents, [
                state,
                sequenceEventsHash,
            ]);
        },
    };
    const SequenceEventsProvable = {
        ...SequenceEvents,
        ...dataAsHash({
            emptyValue: SequenceEvents.empty,
            toJSON(data) {
                return data.map((row) => row.map((e) => Field.toJSON(e)));
            },
            fromJSON(json) {
                let data = json.map((row) => row.map((e) => Field.fromJSON(e)));
                let hash = SequenceEvents.hash(data);
                return { data, hash };
            },
        }),
    };
    return { Events: EventsProvable, SequenceEvents: SequenceEventsProvable };
}
function dataAsHash({ emptyValue, toJSON, fromJSON, }) {
    return {
        emptyValue,
        sizeInFields() {
            return 1;
        },
        toFields({ hash }) {
            return [hash];
        },
        toAuxiliary(value) {
            return [value?.data ?? emptyValue().data];
        },
        fromFields([hash], [data]) {
            return { data, hash };
        },
        toJSON({ data }) {
            return toJSON(data);
        },
        fromJSON(json) {
            return fromJSON(json);
        },
        check() { },
        toInput({ hash }) {
            return { fields: [hash] };
        },
    };
}
module.exports = { createEvents, dataAsHash }; // export { createEvents, dataAsHash };
//# sourceMappingURL=events.js.map