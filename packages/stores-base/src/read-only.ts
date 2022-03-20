import {Readable} from "./types";

/**
 * Create a read-only version of a given store by restricting the available methods
 *
 * _Example_:
 * {@codeblock ../examples/read-only.test.ts#example-read-only}
 *
 * @category Utility
 * @param store the store to be restricted
 */
export function read_only<T>(store: Readable<T>): Readable<T> {
    return {
        subscribe: store.subscribe
    }
}
