import {Dynamic, DynamicResolved} from "./types";

export function is_dynamic_resolved<T>(resolved: Dynamic<T>): resolved is DynamicResolved<T>;
export function is_dynamic_resolved(resolved: any): resolved is DynamicResolved<any>;

export function is_dynamic_resolved(resolved: any): resolved is DynamicResolved<any> {
    return resolved && typeof resolved === 'object' && ('value' in resolved || 'error' in resolved);
}
