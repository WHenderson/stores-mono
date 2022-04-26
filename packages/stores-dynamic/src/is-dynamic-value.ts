import {Dynamic, DynamicValue} from "./types";

export function is_dynamic_value<T>(resolved: Dynamic<T>): resolved is DynamicValue<T>;
export function is_dynamic_value(resolved: any): resolved is DynamicValue<any>;

export function is_dynamic_value(resolved: any): resolved is DynamicValue<any> {
    return resolved && typeof resolved === 'object' && 'value' in resolved;
}
