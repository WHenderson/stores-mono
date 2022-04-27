import {Dynamic, DynamicResolved} from "./types";

/**
 * Returns true if the given argument is a {@link DynamicResolved} value (has either a value or an error property)
 *
 * @param resolved
 */
export function is_dynamic_resolved<T>(resolved: Dynamic<T>): resolved is DynamicResolved<T>;


/**
 * Returns true if the given argument is a resolved value (has either a value or an error property)
 *
 * @param resolved
 */
export function is_dynamic_resolved(resolved: any): resolved is DynamicResolved<unknown>;

export function is_dynamic_resolved(resolved: any): resolved is DynamicResolved<unknown> {
    return resolved && typeof resolved === 'object' && ('value' in resolved || 'error' in resolved);
}
