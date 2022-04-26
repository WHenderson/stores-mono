import {DynamicError} from "./types";

export function is_dynamic_error(resolved: any): resolved is DynamicError {
    return resolved && typeof resolved === 'object' && 'error' in resolved;
}
