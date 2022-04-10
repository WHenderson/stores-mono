import {ComplexSet, Readable, Trigger} from "./types";
import {readable} from "./readable";

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
    transformer: (value: T) => R
) : Readable<R>;

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
    transformer: (value: T, set: ComplexSet<R | undefined>) => R
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
    transformer: (value: T, set: ComplexSet<R>) => R,
    initial_value: R
) : Readable<R>;


export function transform<T, R>(
    trigger: Trigger<R>,
    store: Readable<T>,
    transformer: (value: T, set: ComplexSet<R>) => R,
    initial_value?: R
) : Readable<R>  {
    return readable(
        trigger,
        <R>initial_value!,
        (complexSet) => {
            return store.subscribe(
                value => complexSet(
                    transformer.length > 1
                        ? transformer(value, complexSet)
                        : (<(value: T) => R>transformer)(value)
                ),
                complexSet.invalidate,
                complexSet.revalidate
            );
        }
    );
}
