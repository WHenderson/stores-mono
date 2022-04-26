import {Trigger} from "@crikey/stores-base";
import {DynamicError, DynamicResolved, DynamicValue} from "./types";

export function trigger_dynamic<T>(
    trigger_value: Trigger<T>,
    trigger_error: Trigger<any>
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
