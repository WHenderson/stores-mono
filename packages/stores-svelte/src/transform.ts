import {
    ReadFnAsyncComplex,
    ReadFnSync,
    transform as transformBase,
    trigger_safe_not_equal,
    Writable,
    WriteFnAsync,
    WriteFnSync
} from "@crikey/stores-base";

/**
 * Creates a new {@link Writable} store by applying transform functions on both read and write.
 *
 * _transform data flow_
 * ```mermaid
 *
 * graph LR
 *   set --> write
 *   cache.set --> |changed?| subscribers
 *   subgraph implementation
 *     write --> inner.set --> |inner.changed?| read --> cache.set
 *   end
 * ```
 *
 * @param store input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<T, R>(
    store: Writable<T>,
    read: ReadFnAsyncComplex<T, R | undefined>,
    write: WriteFnAsync<R | undefined, T>
) : Writable<R | undefined>;

/**
 * Creates a new {@link Writable} store by applying transform functions on both read and write.
 *
 * _transform data flow_
 * ```mermaid
 *
 * graph LR
 *   set --> write
 *   cache.set --> |changed?| subscribers
 *   subgraph implementation
 *     write --> inner.set --> |inner.changed?| read --> cache.set
 *   end
 * ```
 *
 * @param store input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 * @param initial_value Initial value of the resulting store
 */
export function transform<T, R>(
    store: Writable<T>,
    read: ReadFnAsyncComplex<T, R>,
    write: WriteFnAsync<R, T>,
    initial_value: R
) : Writable<R>;

/**
 * Creates a new {@link Writable} store by applying transform functions on both read and write.
 *
 * _transform data flow_
 * ```mermaid
 *
 * graph LR
 *   set --> write
 *   cache.set --> |changed?| subscribers
 *   subgraph implementation
 *     write --> inner.set --> |inner.changed?| read --> cache.set
 *   end
 * ```
 *
 * @param store input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<T, R>(
    store: Writable<T>,
    read: ReadFnSync<T, R>,
    write: WriteFnSync<R, T>
) : Writable<R>;

export function transform<T, R>(
    store: Writable<T>,
    read: ReadFnSync<T, R> | ReadFnAsyncComplex<T, R>,
    write: WriteFnSync<R, T> | WriteFnAsync<R, T>,
    initial_value?: R
) : Writable<R> {
    return transformBase(trigger_safe_not_equal, store, <ReadFnAsyncComplex<T, R>>read, write, initial_value!);
}
