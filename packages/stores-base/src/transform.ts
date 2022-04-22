import {ComplexSet, Readable, Trigger, Unsubscriber} from "./types";
import {readable} from "./readable";
import {Action} from "@crikey/stores-base-queue/src";


/** Synchronous callback for deriving a value from resolved input value */
export type TransformFnSync<I,O> = (values: I) => O;

/** Asynchronous callback for deriving a value from resolved input value */
export type TransformFnAsyncComplex<I,O> =
    ((values: I, set: ComplexSet<O>) => Unsubscriber | void);

/**
 * Creates a new store by applying a transform callback to values from the input store.
 * Resulting store values can be provided via the set argument in the transformer callback.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 */
export function transform<T, R>(
    trigger: Trigger<R | undefined>,
    store: Readable<T>,
    transformer: TransformFnAsyncComplex<T, R | undefined>
) : Readable<R | undefined>;

/**
 * Creates a new store by applying a transform callback to values from the input store.
 * Resulting store values can be provided via the set argument in the transformer callback.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 * @param initial_value Initial value of the resulting store
 */
export function transform<T, R>(
    trigger: Trigger<R>,
    store: Readable<T>,
    transformer: TransformFnAsyncComplex<T, R>,
    initial_value: R
) : Readable<R>;

/**
 * Creates a new store by applying a transform callback to values from the input store.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 */
export function transform<T, R>(
    trigger: Trigger<R>,
    store: Readable<T>,
    transformer: TransformFnSync<T, R>
) : Readable<R>;

export function transform<T, R>(
    trigger: Trigger<R>,
    store: Readable<T>,
    transformer: TransformFnSync<T, R> | TransformFnAsyncComplex<T, R>,
    initial_value?: R
) : Readable<R>  {
    return readable(
        trigger,
        <R>initial_value!,
        (complexSet) => {
            let async_cleanup: Action | undefined;
            let store_unsub: Action | undefined = store.subscribe(
                value => {
                    if (transformer.length > 1) {
                        async_cleanup?.();
                        async_cleanup = undefined;

                        const unsub = (<TransformFnAsyncComplex<T, R>>transformer)(value, complexSet); // async
                        if (unsub)
                            async_cleanup = unsub;
                    }
                    else
                        complexSet((<TransformFnSync<T, R>>transformer)(value)); // sync
                },
                complexSet.invalidate,
                complexSet.revalidate
            );

            return () => {
                async_cleanup?.();
                async_cleanup = undefined;

                store_unsub?.();
                store_unsub = undefined;
            };
        }
    );
}
