import {DynamicReadable} from "./types";
import {get} from "@crikey/stores-base";
import {is_dynamic_error} from "./is-dynamic-error";

/**
 * Uses {@link get} to retrieve the current store value and return its error property (or undefined)
 *
 * @param store
 */
export function get_error(store: DynamicReadable<unknown>): any {
    const resolved = get(store);
    return is_dynamic_error(resolved) ? resolved.error : undefined;
}
