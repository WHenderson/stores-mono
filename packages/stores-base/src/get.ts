import {Readable} from "./types";

/**
 * Return the current value of the provided `store`.
 *
 * Works by subscribing and immediately unsubscribing from the given `store`.
 * This is neither efficient nor reactive and should generally be avoided.
 *
 * _Example_:
 * {@codeblock ../examples/get.test.ts#example-get}
 *
 * @category Utility
 * @param store `store` to get the value from
 * @returns the current `store` value
 */
export function get<T>(store: Readable<T>): T {
    let value: T;
    const subscription = store.subscribe((v) => value = v);
    subscription();
    return value!;
}
