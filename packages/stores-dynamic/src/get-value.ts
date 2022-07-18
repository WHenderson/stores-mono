import {Dynamic} from "./types";
import {get} from "@crikey/stores-base";
import {is_dynamic_resolved} from "./is-dynamic-resolved";
import {is_dynamic_value} from "./is-dynamic-value";

/**
 * Uses {@link get} to retrieve the current dynamic value and return its value property (or undefined)
 *
 * @param dynamic
 */
export function get_value<T>(dynamic: Dynamic<T>): T | undefined;

/**
 * Uses {@link get} to retrieve the current dynamic value and return its value property (or default_)
 *
 * @param dynamic
 * @param default_ The value to return if no value is present
 */
export function get_value<T,R>(dynamic: Dynamic<T>, default_: R): T | R;

export function get_value<T, R = undefined>(dynamic: Dynamic<T>, default_?: R): T | R {
    const resolved = is_dynamic_resolved(dynamic)
        ? dynamic
        : get(dynamic);

    return is_dynamic_value(resolved)
    ? resolved.value
    : default_!;
}
