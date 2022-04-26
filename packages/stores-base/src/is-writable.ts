import {Readable, Writable} from "./types";

/**
 * Type guard to determine if store is {@link Writable}
 *
 * @param store
 */
export function is_writable<T>(store: Readable<T> | Writable<T>): store is Writable<T>;

/**
 * Type guard to determine if store is {@link Writable}
 *
 * @param store
 */
export function is_writable<T = unknown>(store: any): store is Writable<T>;

export function is_writable<T = unknown>(store: any): store is Writable<T> {
    return (store
        && typeof store === 'object'
        && 'subscribe' in store
        && 'set' in store
        && 'update' in store
        && typeof store.subscribe === 'function'
        && typeof store.set === 'function'
        && typeof store.update === 'function'
    );
}
