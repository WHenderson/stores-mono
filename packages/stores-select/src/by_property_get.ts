import {ReadSelector} from "./types";

export function by_property_get<I extends object, K extends keyof I>(
    key: K,
    def?: () => I[K]
): ReadSelector<I, I[K]> {
    const default_ = def ?? (() => { throw new Error('property not found') });

    return {
        get(parent) {
            if (!Object.hasOwn(parent, key))
                return default_();
            else
                return parent[key];
        }
    }
}
