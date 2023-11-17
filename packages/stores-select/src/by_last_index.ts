import {ReadSelector, WriteSelector} from "./types";

export function by_last_index<E>(
    def?: () => E
) : ReadSelector<Array<E>, E> & WriteSelector<Array<E>, E> {
    const default_ = def ?? (() => { throw new Error('array is empty') });

    return {
        get(parent) {
            if (parent.length === 0 || !Object.hasOwn(parent, parent.length - 1))
                return default_();

            return parent[parent.length - 1];
        },
        update(parent, value) {
            if (parent.length === 0)
                throw new Error('array is empty');

            const lastIndex = parent.length - 1;

            if (Object.hasOwn(parent, lastIndex) && parent[lastIndex] === value)
                return parent;

            const updated = [...parent];
            updated[lastIndex] = value;
            return <Array<E>>updated;
        }
    }
}
