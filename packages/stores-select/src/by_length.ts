import {ReadSelector, WriteSelector} from "./types";

export function by_length<T extends Array<E>, E>(
): ReadSelector<T, number> & WriteSelector<T, number> {
    return {
        get(parent) {
            return parent.length;
        },
        update(parent, value) {
            if (parent.length === value)
                return parent;

            const updated = [...parent];
            updated.length = value;
            return <T>updated;
        }
    }
}
