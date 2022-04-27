import {DynamicReadable} from "./types";
import {get} from "@crikey/stores-base";
import {is_dynamic_error} from "./is-dynamic-error";

/**
 * Uses {@link get} to retrieve the current store value and return its value property (or throw its error property)
 *
 * _Note: if the store value contains an error, the error will be thrown_
 *
 * @throws Will throw any error property contained within the store value
 * @param store
 */
export function get_value<T>(store: DynamicReadable<T>): T {
    const resolved = get(store);
    if (is_dynamic_error(resolved))
        throw resolved.error;

    return resolved.value;
}
