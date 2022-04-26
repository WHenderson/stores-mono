import {Readable} from "./types";

/**
 * Type guard to determine if store is {@link Readable}
 *
 * @param store
 */
export function is_readable<T>(store: Readable<T>): store is Readable<T>;

/**
 * Type guard to determine if store is {@link Readable}
 *
 * @param store
 */
export function is_readable<T = unknown>(store: any): store is Readable<T>;

export function is_readable<T = unknown>(store: any): store is Readable<T> {
    return (store
        && typeof store === 'object'
        && 'subscribe' in store
        && typeof store.subscribe === 'function'
    );
}
