import {DeleteSelector, ReadSelector, WriteSelector} from "./types";
import {OptionalKeys} from "./util-types";

/**
 * Creates a selector which selects/updates a property of the input object
 *
 * @param key key of property to update
 * @param def function which returns a default value to use if key does not exist. defaults to a function which throws a `property not found` error
 * @return WriteSelector
 */
export function by_property<I extends object, K extends OptionalKeys<I>>(
    key: K,
    def?: () => I[K]
): ReadSelector<I, I[K]> & WriteSelector<I, I[K]> & DeleteSelector<I>;

export function by_property<I extends object, K extends keyof I>(
    key: K,
    def?: () => I[K]
): ReadSelector<I, I[K]> & WriteSelector<I, I[K]>;


export function by_property<I extends object, K extends keyof I>(
    key: K,
    def?: () => I[K]
): ReadSelector<I, I[K]> & WriteSelector<I, I[K]> & DeleteSelector<I> {
    const default_ = def ?? (() => { throw new Error('property not found') });

    return {
        get(parent) {
            if (!Object.hasOwn(parent, key))
                return default_();
            else
                return parent[key];
        },
        update(parent, value) {
            if (Object.hasOwn(parent, key) && parent[key] === value)
                return parent;

            return {
                ...parent,
                [key]: value
            }
        },
        delete(parent) {
            if (!Object.hasOwn(parent, key))
                return parent;

            const { [key]: discard, ...updated } = parent;
            return <I>updated;
        }
    }
}
