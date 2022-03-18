import {Trigger} from "@crikey/stores-base";
import {DynamicResolved} from "./types";

export function trigger_dynamic<T>(
    trigger_value: Trigger<T>,
    trigger_error: Trigger<any>
): Trigger<DynamicResolved<T>> {
    return (initial: boolean, new_value: DynamicResolved<T>, old_value?: DynamicResolved<T>) => {
        if (!old_value)
            return true;

        if (('error' in new_value) !== ('error' in old_value)
        ||  ('value' in new_value) !== ('value' in old_value)
        ||  ('subscriber' in new_value) !== ('subscriber' in old_value))
            return true;

        if ('error' in new_value && 'error' in old_value)
            return trigger_error(initial, new_value.error, old_value.error);
        if ('value' in new_value && 'value' in old_value)
            return trigger_value(initial, new_value.value, old_value.value);

        return false;
    };
}
