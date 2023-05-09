import {Dynamic, DynamicResolved} from "./types";
import {Invalidate, noop, Revalidate, Subscriber, Unsubscriber} from "@crikey/stores-base";
import {is_dynamic_resolved} from "./is-dynamic-resolved";
import {actionRunner} from "@crikey/stores-base-queue";

export function subscribe<T>(dynamic: Dynamic<T>, run: Subscriber<DynamicResolved<T>>, invalidate?: Invalidate, revalidate?: Revalidate) : Unsubscriber {
    if (is_dynamic_resolved(dynamic)) {
        actionRunner(
            () => {
                run(dynamic);
            }
        );

        return noop;
    }
    else
        return dynamic.subscribe(run, invalidate, revalidate);
}
