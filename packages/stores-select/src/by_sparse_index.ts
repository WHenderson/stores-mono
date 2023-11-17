import {DeleteSelector, ReadSelector, WriteSelector} from "./types";

export function by_sparse_index<T extends Array<E>,I extends keyof T & number, E>(
    index: I,
    def?: () => T[0]
) : ReadSelector<T, T[0]> & WriteSelector<T, T[0]> & DeleteSelector<T>;

export function by_sparse_index<T extends Array<E>,I extends keyof T & number, E>(
    index: I,
    def?: () => E
) : ReadSelector<T, E> & WriteSelector<T, E> & DeleteSelector<T> {
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

            const updated = parent.slice();
            updated[index] = value;
            return <T>updated;
        },
        delete(parent) {
            if (!Object.hasOwn(parent, index))
                return parent;

            const updated = parent.slice();
            delete updated[index];
            return <T>updated;
        }
    }
}
