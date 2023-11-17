import {DeleteSelector, ReadSelector, WriteSelector} from "./types";

export function by_set_element<I>(item: I)
    : ReadSelector<Set<I>,boolean> & WriteSelector<Set<I>, boolean> & DeleteSelector<Set<I>>
{
    return {
        get(parent) {
            return parent.has(item);
        },
        update(parent, value) {
            if (value === parent.has(item))
                return parent;

            const updated = new Set(parent);
            if (value)
                updated.add(item);
            else
                updated.delete(item);

            return updated;
        },
        delete(parent) {
            if (!parent.has(item))
                return parent;

            const updated = new Set(parent);
            updated.delete(item);
            return updated;
        }
    }
}
