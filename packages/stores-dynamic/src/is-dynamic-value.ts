import {Dynamic, DynamicValue} from "./types";

/**
 * Returns true if the given argument is a {@link DynamicValue}
 *
 * @param resolved
 */
export function is_dynamic_value<T>(resolved: Dynamic<T>): resolved is DynamicValue<T>;

/**
 * Returns true if the given argument is a {@link DynamicValue}
 *
 * @param resolved
 */
export function is_dynamic_value(resolved: any): resolved is DynamicValue<unknown>;

export function is_dynamic_value(resolved: any): resolved is DynamicValue<unknown> {
    return resolved && typeof resolved === 'object' && 'value' in resolved;
}
