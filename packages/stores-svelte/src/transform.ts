import {
    ReadFnAsyncComplex,
    ReadFnSync,
    transform as transformBase,
    TransformedStore,
    trigger_safe_not_equal,
    Writable,
    WriteFnAsync,
    WriteFnSync
} from "@crikey/stores-base";

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnAsyncComplex<I, O | undefined>,
    write: WriteFnAsync<O | undefined, I>
) : TransformedStore<O | undefined>;

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnAsyncComplex<I, O | undefined>,
    write: WriteFnSync<O | undefined, I>
) : TransformedStore<O | undefined>;

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 * @param initial_value Initial value of the resulting store
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnAsyncComplex<I, O>,
    write: WriteFnAsync<O, I>,
    initial_value: O
) : TransformedStore<O>;

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 * @param initial_value Initial value of the resulting store
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnAsyncComplex<I, O>,
    write: WriteFnSync<O, I>,
    initial_value: O
) : TransformedStore<O>;


/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnSync<I, O>,
    write: WriteFnAsync<O, I>
) : TransformedStore<O>;

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnSync<I, O>,
    write: WriteFnSync<O, I>
) : TransformedStore<O>;


export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnSync<I, O> | ReadFnAsyncComplex<I, O>,
    write: WriteFnSync<O, I> | WriteFnAsync<O, I>,
    initial_value?: O
) : TransformedStore<O> {
    return transformBase(trigger_safe_not_equal, store$, <ReadFnAsyncComplex<I, O>>read, write, initial_value!);
}
