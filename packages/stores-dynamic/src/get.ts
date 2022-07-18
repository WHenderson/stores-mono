import {Dynamic, DynamicResolved} from "./types";
import {is_dynamic_resolved} from "./is-dynamic-resolved";
import {get as baseGet} from "@crikey/stores-base";

export function get<T>(dynamic: Dynamic<T>): DynamicResolved<T> {
    if (is_dynamic_resolved(dynamic))
        return dynamic;

    return baseGet(dynamic);
}
