import {Readable} from "./types";

/**
 * Create a read-only version of a given store by restricting the available methods
 * @param store the store to be restricted
 */
export function readOnly<T>(store: Readable<T>): Readable<T> {
    return {
        subscribe: store.subscribe
    }
}
