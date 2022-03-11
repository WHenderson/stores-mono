import {Readable} from "./types";

/**
 * Return the current value of the provided store
 * @param store store to get the value from
 */
export function get<T>(store: Readable<T>): T {
    let value: T;
    const subscription = store.subscribe((v) => value = v);
    subscription();
    return value!;
}
