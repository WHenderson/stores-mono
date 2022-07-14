import {Dynamic, DynamicDependents, DynamicReadable, DynamicResolved, DynamicValue} from "./types";
import {
    Action,
    ComplexSet,
    derive,
    is_readable,
    readable,
    Readable,
    Trigger,
    trigger_always,
    Unsubscriber,
    UpdaterAsync,
    UpdaterSync
} from "@crikey/stores-base";
import {is_dynamic_resolved} from "./is-dynamic-resolved";
import {default_trigger_dynamic} from "./create-trigger-dynamic";
import {Invalidate, noop, Revalidate, Subscriber} from "@crikey/stores-base";

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
 * @param dirty if true, creates a cheap wrapper around each subscription instead of a fully derived store
 */
export function dynamic<R>(
    store: Readable<R>,
    dirty?: boolean
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

// ------------------------

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
    args: A,
    calculate: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, ComplexSet<DynamicResolved<R>>>,
    initial_value: DynamicResolved<R>
) : DynamicReadable<R>;



// ---

export function dynamic<A extends Inputs, R>(
    store_or_trigger_or_args_or_calculate: Readable<R> | Trigger<DynamicResolved<R>> | A | Function,
    dirty_or_maybe_args_or_calculate_or_initial_value?: A | Function | DynamicResolved<R> | boolean,
    maybe_calculate_or_initial_value?: Function | DynamicResolved<R>,
    maybe_initial_value?: DynamicResolved<R>)
: DynamicReadable<R> {
    if (is_readable(store_or_trigger_or_args_or_calculate)) {
        const store = store_or_trigger_or_args_or_calculate;
        const dirty = <boolean | undefined>dirty_or_maybe_args_or_calculate_or_initial_value ?? false;

        if (!dirty) {
            return derive(
                trigger_always,
                store,
                value => ({value})
            );
        }
        else {
            return {
                subscribe: (run: Subscriber<DynamicResolved<R>>, invalidator: Invalidate = noop, revalidator: Revalidate = noop): Unsubscriber => {
                    return store.subscribe((value) => run({ value }), invalidator, revalidator);
                }
            }
        }
    }

    const [trigger, args, calculator, initial_value] = (() => {
        if (typeof store_or_trigger_or_args_or_calculate === 'function') {
            const trigger_or_calculate = store_or_trigger_or_args_or_calculate;
            if (Array.isArray(dirty_or_maybe_args_or_calculate_or_initial_value)) {
                const trigger = <Trigger<DynamicResolved<R>>>trigger_or_calculate;
                const args = dirty_or_maybe_args_or_calculate_or_initial_value;
                const calculate = <Function>maybe_calculate_or_initial_value;
                const initial_value = maybe_initial_value;
                return [trigger, args, calculate, initial_value];
            }
            else
            if (typeof dirty_or_maybe_args_or_calculate_or_initial_value === 'function') {
                const trigger = <Trigger<DynamicResolved<R>>>trigger_or_calculate;
                const args = undefined;
                const calculate = dirty_or_maybe_args_or_calculate_or_initial_value;
                const initial_value = <DynamicResolved<R> | undefined>maybe_calculate_or_initial_value;
                return [trigger, args, calculate, initial_value];
            }
            else {
                const trigger = default_trigger_dynamic;
                const args = undefined;
                const calculate = trigger_or_calculate;
                const initial_value = <DynamicResolved<R> | undefined>dirty_or_maybe_args_or_calculate_or_initial_value;
                return [trigger, args, calculate, initial_value];
            }
        }
        else {
            const trigger = default_trigger_dynamic;
            const args = store_or_trigger_or_args_or_calculate;
            const calculate = <Function>dirty_or_maybe_args_or_calculate_or_initial_value;
            const initial_value = <DynamicResolved<R> | undefined>maybe_calculate_or_initial_value;
            return [trigger, args, calculate, initial_value];
        }
    })();

    const is_async = args ? calculator.length > 2 : calculator.length > 1;

    let is_const_cached = false;

    return readable<DynamicResolved<R>>(
        trigger,
        initial_value ?? { value: <R>undefined! },
        ({ set, update, invalidate, revalidate }) => {
            if (is_const_cached)
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

            const local_update = (updater: UpdaterAsync<DynamicResolved<R>> | UpdaterSync<DynamicResolved<R>>) => {
                const dependencies_spread = get_dependencies_spread();

                update(value => {
                    try {
                        if (updater.length <= 1)
                            return { ...(<UpdaterSync<DynamicResolved<R>>>updater)(value), ...dependencies_spread };
                        else {
                            (<UpdaterAsync<DynamicResolved<R>>>updater)(value, local_set);
                            return;
                        }
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

                const is_const = !is_async
                    && (!dependencies_spread.dependencies || [...dependencies_spread.dependencies.values()].every(store => {
                        const value = subscriptions.get(store)?.[1];
                        return !value || value?.is_const;
                    }));

                const is_const_spread = is_const ? { is_const: true } : {};

                if (result === undefined && is_async) {
                    // do nothing
                }
                else
                if (typeof result === 'function' && is_async) {
                    cleanup = result;
                }
                else
                if (is_dynamic_resolved(result)) {
                    const ultimate_result = {...is_const_spread, ...result, ...dependencies_spread };
                    is_const_cached = !!ultimate_result.is_const;
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
                            const ultimate_result = { ...is_const_spread, ...result, dependencies: extra_dependencies };
                            is_const_cached = !!ultimate_result.is_const;
                            set(ultimate_result);
                        },
                        invalidate,
                        revalidate
                    );
                }
                else {
                    const ultimate_result = { error: new TypeError('invalid result type'), ...dependencies_spread, ...is_const_spread }
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
