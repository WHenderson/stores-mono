import {Dynamic, DynamicDependents, DynamicReadable, DynamicResolved, DynamicValue} from "./types";
import {
    Action,
    ComplexSet,
    is_readable,
    readable,
    Readable,
    transform,
    Trigger,
    trigger_always,
    Unsubscriber,
    Updater
} from "@crikey/stores-base";
import {is_dynamic_resolved} from "./is-dynamic-resolved";

export type ResolveDynamic = <V>(arg: Dynamic<V>) => V;
export type ComplexResolveDynamic = ResolveDynamic & { resolve: ResolveDynamic };

export type Inputs = [unknown, ...unknown[]] | Array<unknown>; // Prioritise tuple type

export type DeriveFn<A, R, SYNC, ASYNC> =
    [A] extends [never] ? (
        [ASYNC] extends [never]
        ? ((resolve: SYNC) => R)
        : ((resolve: SYNC, set: ASYNC) => R | Unsubscriber | void)
    ) : (
        [ASYNC] extends [never]
        ? ((args: A, resolve: SYNC) => R)
        : ((args: A, resolve: SYNC, set: ASYNC) => R | Unsubscriber | void)
    );

/**
 * Transforms a regular store into a dynamic store by transforming its value into a @{link DynamicValue}
 *
 * See other signatures for alternate semantics
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-to-dynamic}
 *
 * @param store the input store to transform
 */
export function dynamic<R>(
    store: Readable<R>
): Readable<DynamicValue<R>>;


/**
 * Derives a store via a calculation callback. Calculations can be dependent on any number of stores
 * and will be recalculated as needed,
 * Note: Whilst an array of arguments can be provided to be passed to the calculation, store dependencies need
 * not be included in this list.
 * The only requirement is that they be resolved via the `resolve` function passed to the `calculate` callback.
 *
 * Equivalent of {@link derive}, but store dependencies are determined dynamically as needed.
 *
 * For asynchronous usage, see alternate signatures.
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-dynamic-static}
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-dynamic-errors}
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param calculate callback used to calculate the resulting store value
 */
export function dynamic<R>(
    trigger: Trigger<DynamicResolved<R>>,
    calculate: DeriveFn<never, Dynamic<R>, ComplexResolveDynamic, never>
) : DynamicReadable<R>;

/**
 * Derives a store via a calculation callback. Calculations can be dependent on any number of stores
 * and will be recalculated as needed,
 * Note: Whilst an array of arguments can be provided to be passed to the calculation, store dependencies need
 * not be included in this list.
 * The only requirement is that they be resolved via the `resolve` function passed to the `calculate` callback.
 *
 * Equivalent of {@link derive}, but store dependencies are determined dynamically as needed.
 *
 * For synchronous usage, see alternate signatures.
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-dynamic-static}
 * _Note that if a dependency changes, the entire function is reevaluated_
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param calculate callback used to calculate the resulting store value
 */
export function dynamic<R>(
    trigger: Trigger<DynamicResolved<R>>,
    calculate: DeriveFn<never, Dynamic<R>, ComplexResolveDynamic, ComplexSet<DynamicResolved<R | undefined>>>
) : DynamicReadable<R | undefined>;

/**
 * Derives a store via a calculation callback. Calculations can be dependent on any number of stores
 * and will be recalculated as needed,
 * Note: Whilst an array of arguments can be provided to be passed to the calculation, store dependencies need
 * not be included in this list.
 * The only requirement is that they be resolved via the `resolve` function passed to the `calculate` callback.
 *
 * Equivalent of {@link derive}, but store dependencies are determined dynamically as needed.
 *
 * For synchronous usage, see alternate signatures.
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-dynamic-static}
 * _Note that if a dependency changes, the entire function is reevaluated_
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param calculate callback used to calculate the resulting store value
 * @param initial_value initial value
 */
export function dynamic<R>(
    trigger: Trigger<DynamicResolved<R>>,
    calculate: DeriveFn<never, Dynamic<R>, ComplexResolveDynamic, ComplexSet<DynamicResolved<R>>>,
    initial_value: DynamicResolved<R>
) : DynamicReadable<R>;

/**
 * Derives a store via a calculation callback. Calculations can be dependent on any number of stores
 * and will be recalculated as needed,
 * Note: Whilst an array of arguments can be provided to be passed to the calculation, store dependencies need
 * not be included in this list.
 * The only requirement is that they be resolved via the `resolve` function passed to the `calculate` callback.
 *
 * Equivalent of {@link derive}, but store dependencies are determined dynamically as needed.
 *
 * For asynchronous usage, see alternate signatures.
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-dynamic-static}
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-dynamic-errors}
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param args array of arguments to be passed to the callback unchanged
 * @param calculate callback used to calculate the resulting store value
 */
export function dynamic<A extends Inputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args: A,
    calculate: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, never>
) : DynamicReadable<R>;

/**
 * Derives a store via a calculation callback. Calculations can be dependent on any number of stores
 * and will be recalculated as needed,
 * Note: Whilst an array of arguments can be provided to be passed to the calculation, store dependencies need
 * not be included in this list.
 * The only requirement is that they be resolved via the `resolve` function passed to the `calculate` callback.
 *
 * Equivalent of {@link derive}, but store dependencies are determined dynamically as needed.
 *
 * For synchronous usage, see alternate signatures.
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-dynamic-static}
 * _Note that if a dependency changes, the entire function is reevaluated_
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param args array of arguments to be passed to the callback unchanged
 * @param calculate callback used to calculate the resulting store value
 */
export function dynamic<A extends Inputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args: A,
    calculate: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, ComplexSet<DynamicResolved<R | undefined>>>
) : DynamicReadable<R | undefined>;

/**
 * Derives a store via a calculation callback. Calculations can be dependent on any number of stores
 * and will be recalculated as needed,
 * Note: Whilst an array of arguments can be provided to be passed to the calculation, store dependencies need
 * not be included in this list.
 * The only requirement is that they be resolved via the `resolve` function passed to the `calculate` callback.
 *
 * Equivalent of {@link derive}, but store dependencies are determined dynamically as needed.
 *
 * For synchronous usage, see alternate signatures.
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/dynamic.test.ts#example-dynamic-static}
 * _Note that if a dependency changes, the entire function is reevaluated_
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param args array of arguments to be passed to the callback unchanged
 * @param calculate callback used to calculate the resulting store value
 * @param initial_value initial value
 */
export function dynamic<A extends Inputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args: A,
    calculate: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, ComplexSet<DynamicResolved<R>>>,
    initial_value: DynamicResolved<R>
) : DynamicReadable<R>;

export function dynamic<A extends Inputs, R>(
    trigger_or_store: Trigger<DynamicResolved<R>> | Readable<R>,
    args_or_calculator?: A | Function,
    calculate_or_initial_value?: Function | DynamicResolved<R>,
    maybe_initial_value?: DynamicResolved<R>)
: DynamicReadable<R> {
    if (typeof trigger_or_store !== 'function') {
        return transform<R, DynamicValue<R>>(
            trigger_always,
            trigger_or_store,
            value => ({ value })
        );
    }

    const trigger = trigger_or_store;

    const [args, calculator, initial_value] =
        (typeof args_or_calculator === 'function')
        ? [undefined, args_or_calculator, <DynamicResolved<R> | undefined>calculate_or_initial_value]
        : [args_or_calculator!, <Function>calculate_or_initial_value, maybe_initial_value];

    const is_async = args ? calculator.length > 2 : calculator.length > 1;

    let is_static_cached = false;

    return readable<DynamicResolved<R>>(
        trigger,
        initial_value ?? { value: <R>undefined! },
        ({ set, update, invalidate, revalidate }) => {
            if (is_static_cached)
                return; // static value already cached, no need to recalculate

            type Value = DynamicResolved<unknown>;
            type Subscription = [Unsubscriber, undefined | Value];
            const subscriptions = new Map<DynamicReadable<unknown>, Subscription>();
            const pending = new Set<DynamicReadable<unknown>>();
            const used = new Set<DynamicReadable<unknown>>();

            let tracked_dependencies: DynamicDependents | undefined;
            let changed = true;

            invalidate();

            const local_resolve = <V>(arg: Dynamic<V>): V => {
                if ('error' in arg)
                    throw arg.error;
                if ('value' in arg)
                    return arg.value;

                used.add(arg);

                let cache = subscriptions.get(arg);
                let cacheValue: Value | undefined = cache?.[1];

                if (!cache) {
                    tracked_dependencies = undefined;

                    let initialised = false;

                    const unsubscribe = arg.subscribe(
                        (value) => {
                            cacheValue = value;

                            if (cache)
                                cache[1] = cacheValue;
                            changed = true;
                            pending.delete(arg);
                            if (initialised)
                                sync();
                        },
                        () => {
                            pending.add(arg);
                            invalidate();
                        },
                        () => {
                            pending.delete(arg);
                            if (initialised)
                                sync();
                        }
                    );

                    if (!cacheValue)
                        throw new ReferenceError('store did not satisfy contract');

                    cache = [
                        unsubscribe,
                        cacheValue
                    ];

                    subscriptions.set(
                        arg,
                        cache
                    );

                    initialised = true;
                }

                if ('error' in cacheValue!)
                    throw cacheValue.error;

                return <V>(cacheValue!.value);
            }

            const complex_resolve = Object.assign(
                <V>(arg: Dynamic<V>) => local_resolve(arg),
                {
                    resolve: local_resolve
                }
            );

            const get_dependencies_spread = () => {
                if (used.size === 0)
                    tracked_dependencies = undefined;
                else
                if (tracked_dependencies?.size !== used.size)
                    tracked_dependencies = new Set(used.keys());

                if (tracked_dependencies)
                    return { dependencies: tracked_dependencies }
                else
                    return {};
            }

            const local_set = (value: DynamicResolved<R>) => {
                const dependencies_spread = get_dependencies_spread();

                set({ ...value, ...dependencies_spread});
            }

            const local_update = (updater: Updater<DynamicResolved<R>>) => {
                const dependencies_spread = get_dependencies_spread();

                update(value => {
                    try {
                        return { ...updater(value), ...dependencies_spread };
                    }
                    catch (error) {
                        return { error, ...dependencies_spread }
                    }
                });
            }

            const complex_set = Object.assign(
                (value: DynamicResolved<R>) => local_set(value),
                {
                    set: local_set,
                    update: local_update,
                    invalidate,
                    revalidate
                }
            );

            let cleanup: Action | undefined;

            const params: unknown[] = [complex_resolve];
            if (args)
                params.unshift(args);
            if (is_async)
                params.push(complex_set);

            const execute = (): Dynamic<R> | Unsubscriber | void => {
                try {
                    return calculator(...params);
                }
                catch (ex) {
                    return { error: ex };
                }
            }

            const sync = () => {
                if (!changed || pending.size)
                    return;

                changed = false;
                cleanup?.();
                cleanup = undefined;
                used.clear();

                const result = execute();

                // unsubscribe from unused items
                subscriptions.forEach(
                    ([unsubscribe, ], store) => {
                        if (!used.has(store)) {
                            unsubscribe();
                            subscriptions.delete(store);
                            pending.delete(store);
                        }
                    }
                );

                const dependencies_spread = get_dependencies_spread();

                used.clear();

                const is_static = !is_async
                    && (!dependencies_spread.dependencies || [...dependencies_spread.dependencies.values()].every(store => {
                        const value = subscriptions.get(store)?.[1];
                        return !value || value?.is_static;
                    }));

                const is_static_spread = is_static ? { is_static: true } : {};

                if (result === undefined && is_async) {
                    // do nothing
                }
                else
                if (typeof result === 'function' && is_async) {
                    cleanup = result;
                }
                else
                if (is_dynamic_resolved(result)) {
                    const ultimate_result = {...is_static_spread, ...result, ...dependencies_spread };
                    is_static_cached = !!ultimate_result.is_static;
                    set(ultimate_result);
                }
                else
                if (is_readable(result)) {
                    const extra_dependencies = new Set([
                        ...(dependencies_spread.dependencies ?? []),
                        result
                    ]);

                    cleanup = result.subscribe(
                        (result) => {
                            const ultimate_result = { ...is_static_spread, ...result, dependencies: extra_dependencies };
                            is_static_cached = !!ultimate_result.is_static;
                            set(ultimate_result);
                        },
                        invalidate,
                        revalidate
                    );
                }
                else {
                    const ultimate_result = { error: new TypeError('invalid result type'), ...dependencies_spread, ...is_static_spread }
                    set(ultimate_result);
                }
            }

            const stop = () => {
                subscriptions.forEach(
                    ([unsubscribe,]) => {
                        unsubscribe();
                    }
                );
                subscriptions.clear();
                pending.clear();
                used.clear();
                cleanup?.();
                cleanup = undefined;
            }

            sync();

            return stop;
        },
    );
}
