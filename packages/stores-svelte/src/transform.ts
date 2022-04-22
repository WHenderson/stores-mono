import {
    Readable,
    transform as transformBase,
    TransformFnAsyncComplex,
    TransformFnSync,
    trigger_safe_not_equal
} from "@crikey/stores-base";

/**
 * Creates a new store by applying a transform callback to values from the input store.
 * Resulting store values can be provided via the set argument in the transformer callback.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 */
export function transform<T, R>(
    store: Readable<T>,
    transformer: TransformFnAsyncComplex<T, R | undefined>
) : Readable<R | undefined>;

/**
 * Creates a new store by applying a transform callback to values from the input store.
 * Resulting store values can be provided via the set argument in the transformer callback.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 * @param initial_value Initial value of the resulting store
 */
export function transform<T, R>(
    store: Readable<T>,
    transformer: TransformFnAsyncComplex<T, R>,
    initial_value: R
) : Readable<R>;

/**
 * Creates a new store by applying a transform callback to values from the input store.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 */
export function transform<T, R>(
    store: Readable<T>,
    transformer: TransformFnSync<T, R>
) : Readable<R>;

export function transform<T, R>(
    store: Readable<T>,
    transformer: TransformFnSync<T, R> | TransformFnAsyncComplex<T, R>,
    initial_value?: R
) : Readable<R>  {
    return transformBase(trigger_safe_not_equal, store, <TransformFnAsyncComplex<T, R>>transformer, initial_value!);
}
