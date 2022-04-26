import {Dynamic} from "./types";
import {get_value} from "./get-value";

export function resolve<T>(item: Dynamic<T>): T {
    if ('error' in item)
        throw item.error;
    if ('value' in item)
        return item.value;

    return get_value(item);
}
