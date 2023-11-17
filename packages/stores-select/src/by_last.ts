import {ReadSelector, WriteSelector} from "./types";

export function by_last<T extends Array<E>, E>(
    def?: () => E
) : ReadSelector<T, E> & WriteSelector<T, E> {
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
            return <T>updated;
        }
    }
}
