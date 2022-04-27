import {Dynamic} from "./types";
import {get_value} from "./get-value";

/**
 * Resolves the given {@link Dynamic} item to its contained value, or throws its contained error
 *
 * @throws the contained error if present
 * @param item
 */
export function resolve<T>(item: Dynamic<T>): T {
    if ('error' in item)
        throw item.error;

    if ('value' in item)
        return item.value;

    return get_value(item);
}
