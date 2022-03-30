import {Readable, Writable} from "./types";

/**
 * Type guard to determine if store is {@link Writable}
 *
 * @param store
 */
export function is_writable<T>(store: Readable<T> | Writable<T>): store is Writable<T> {
    return 'set' in store && 'update' in store;
}
