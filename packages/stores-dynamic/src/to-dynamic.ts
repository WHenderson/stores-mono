import {DynamicValue} from "./types";
import {derive, Readable, Trigger} from "@crikey/stores-base";
import {trigger_dynamic} from "./trigger-dynamic";

export function to_dynamic<T>(trigger: Trigger<T>, store: Readable<T>): Readable<DynamicValue<T>> {
    return derive(trigger_dynamic(trigger, trigger), store, value => {
        return <DynamicValue<T>>{ value };
    });
}
