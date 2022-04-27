import {DynamicError} from "./types";

/**
 * Returns true if the given argument is a {@link DynamicError}
 *
 * @param resolved
 */
export function is_dynamic_error(resolved: any): resolved is DynamicError {
    return resolved && typeof resolved === 'object' && 'error' in resolved;
}
