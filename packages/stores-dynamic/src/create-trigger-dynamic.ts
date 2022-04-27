import {Trigger} from "@crikey/stores-base";
import {DynamicError, DynamicResolved, DynamicValue} from "./types";
import {trigger_strict_not_equal} from "@crikey/stores-base";

/**
 * Creates a trigger function for {@link DynamicResolved} values
 *
 * @param trigger_value trigger function for comparing values
 * @param trigger_error trigger function for comparing errors
 */
export function create_trigger_dynamic<T>(
    trigger_value: Trigger<T> = trigger_strict_not_equal,
    trigger_error: Trigger<any> = trigger_strict_not_equal
): Trigger<DynamicResolved<T>> {
    return (initial: boolean, new_value: DynamicResolved<T>, old_value?: DynamicResolved<T>) => {
        if (!old_value)
            return true;

        if (('error' in new_value) !== ('error' in old_value)
        ||  ('value' in new_value) !== ('value' in old_value))
            return true;

        if ('error' in new_value)
            return trigger_error(initial, new_value.error, (<DynamicError>old_value).error);
        else
            return trigger_value(initial, new_value.value, (<DynamicValue<T>>old_value).value);
    };
}
