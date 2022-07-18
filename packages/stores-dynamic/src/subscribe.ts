import {Dynamic, DynamicResolved} from "./types";
import {Invalidate, noop, Revalidate, Subscriber, Unsubscriber} from "@crikey/stores-base";
import {is_dynamic_resolved} from "./is-dynamic-resolved";
import {store_runner} from "@crikey/stores-base-queue";

export function subscribe<T>(dynamic: Dynamic<any>, run: Subscriber<DynamicResolved<T>>, invalidate?: Invalidate, revalidate?: Revalidate) : Unsubscriber {
    if (is_dynamic_resolved(dynamic)) {
        store_runner(
            () => {
                run(dynamic);
            }
        );

        return noop;
    }
    else
        return dynamic.subscribe(run, invalidate, revalidate);
}
