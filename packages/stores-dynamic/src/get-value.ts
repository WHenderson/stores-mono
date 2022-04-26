import {DynamicReadable} from "./types";
import {get} from "@crikey/stores-base";
import {is_dynamic_value} from "./is-dynamic-value";

export function get_value<T>(store: DynamicReadable<T>): T {
    const resolved = get(store);
    if (!is_dynamic_value(resolved))
        throw resolved.error;

    return resolved.value;
}
