import {DeleteSelector, ReadSelector, WriteSelector} from "./types";

export function by_key<K,V>(
    key: K,
    def?: () => V
) : ReadSelector<Map<K,V>,V> & WriteSelector<Map<K,V>, V> & DeleteSelector<Map<K,V>>{
    const default_ = def ?? (() => { throw new Error('key not found') });

    return {
        get(parent) {
            if (!parent.has(key))
                return default_();
            else
                return parent.get(key)!;
        },
        update(parent, value) {
            if (parent.has(key) && parent.get(key) === value)
                return parent;

            const updated = new Map(parent);
            updated.set(key, value);
            return updated;
        },
        delete(parent) {
            if (!parent.has(key))
                return parent;

            const updated = new Map(parent);
            updated.delete(key);
            return updated;
        }
    }
}
