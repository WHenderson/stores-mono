import {DynamicValue} from "./types";
import {Readable} from "@crikey/stores-base";
import {Invalidator, Revalidator, Subscriber, Unsubscriber} from "@crikey/stores-base";

/**
 * Creates a dynamic store by wrapping the input stores wrapper.
 *
 * Note that for a given event, each subscriber will receive a different object (albeit with the same inner value).
 *
 * @param store
 */
export function to_dynamic<T>(store: Readable<T>): Readable<DynamicValue<T>> {
    return {
        subscribe(this: void, run: Subscriber<DynamicValue<T>>, invalidate?: Invalidator, revalidate?: Revalidator) : Unsubscriber {
            return store.subscribe(
                (value) => {
                    run({ value });
                },
                invalidate,
                revalidate
            );
        }
    }
    /*
    return derive(trigger_dynamic(trigger, trigger), store, value => {
        return <DynamicValue<T>>{ value };
    });*/
}
