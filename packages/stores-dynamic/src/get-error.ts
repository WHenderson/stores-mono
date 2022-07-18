import {Dynamic} from "./types";
import {get} from "@crikey/stores-base";
import {is_dynamic_error} from "./is-dynamic-error";
import {is_dynamic_resolved} from "./is-dynamic-resolved";

/**
 * Uses {@link get} to retrieve the current dynamic value and return its error property (or undefined)
 *
 * @param dynamic
 */
export function get_error(dynamic: Dynamic<unknown>): any {
    const resolved = is_dynamic_resolved(dynamic)
    ? dynamic
    : get(dynamic);

    return is_dynamic_error(resolved) ? resolved.error : undefined;
}
