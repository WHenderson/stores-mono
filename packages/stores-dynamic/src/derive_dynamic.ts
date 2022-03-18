import {DynamicValue} from "./types";
import {Readable} from "@crikey/stores-base";
import {derive} from "@crikey/stores-base";

/**
 * Creates a dynamic store by deriving the given store.
 *
 * Note that while the overhead for this function is larger than to_dynamic, it doesn't suffer the same issues.
 * Notably: For a given event, subscribers will all receive the same object.
 *
 * @param store to convert
 * @returns a dynamic store whose inner value is that of the wrapped store
 */
export function derive_dynamic<T>(store: Readable<T>): Readable<DynamicValue<T>> {
    return derive(() => true, store, value => {
        return <DynamicValue<T>>{ value };
    });
}
