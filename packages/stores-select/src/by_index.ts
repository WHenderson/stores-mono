import {ReadSelector, WriteSelector} from "./types";

export function by_index<T extends Array<E>,I extends keyof T & number, E>(
    index: I,
    def?: () => E
) : ReadSelector<T, E> & WriteSelector<T, E> {
    const default_ = def ?? (() => { throw new Error('index not found') });

    return {
        get(parent) {
            if (!Object.hasOwn(parent, index))
                return default_();

            return parent[index];
        },
        update(parent, value) {
            if (Object.hasOwn(parent, index) && parent[index] === value)
                return parent;

            const updated = [...parent];
            updated[index] = value;
            return <T>updated;
        }
    }
}
