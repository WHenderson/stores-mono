import {Dynamic, DynamicDependents, DynamicReadable, DynamicResolved, DynamicValue} from "./types";
import {derive, noop, readable, Readable, Trigger, trigger_always, Unsubscriber} from "@crikey/stores-base";
import {ComplexSet, Updater} from "@crikey/stores-base/src";

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

export function dynamic<R>(
    store: Readable<R>
): Readable<DynamicValue<R>>;


export function dynamic<R>(
    trigger: Trigger<Dynamic<R>>,
    calculate: DeriveFn<never, Dynamic<R>, ComplexResolveDynamic, never>,
    initial_value?: DynamicResolved<R>
) : DynamicReadable<R>;

export function dynamic<R>(
    trigger: Trigger<Dynamic<R>>,
    calculate: DeriveFn<never, Dynamic<R>, ComplexResolveDynamic, ComplexSet<DynamicResolved<R>>>,
    initial_value?: DynamicResolved<R>
) : DynamicReadable<R>;

/**
 * docs a
 * @param trigger
 * @param args
 * @param calculate
 * @param initial_value
 */
export function dynamic<A extends Inputs, R>(
    trigger: Trigger<Dynamic<R>>,
    args: A,
    calculate: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, never>,
    initial_value?: DynamicResolved<R>
) : DynamicReadable<R>;

/**
 * docs b
 * @param trigger
 * @param args
 * @param calculate
 * @param initial_value
 */
export function dynamic<A extends Inputs, R>(
    trigger: Trigger<Dynamic<R>>,
    args: A,
    calculate: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, ComplexSet<DynamicResolved<R>>>,
    initial_value?: DynamicResolved<R>
) : DynamicReadable<R>;

export function dynamic<A extends Inputs, R>(
    trigger_or_store: Trigger<Dynamic<R>> | Readable<R>,
    args_or_calculator?: A | Function,
    calculate_or_initial_value?: Function | DynamicResolved<R>,
    maybe_initial_value?: DynamicResolved<R>)
: DynamicReadable<R> {
    if (typeof trigger_or_store !== 'function') {
        return derive(trigger_always, trigger_or_store, value => {
            return { value };
        });
    }

    const trigger = trigger_or_store;

    const [args, calculator, initial_value] =
        (typeof args_or_calculator === 'function')
        ? [undefined, args_or_calculator, <DynamicResolved<R> | undefined>calculate_or_initial_value]
        : [args_or_calculator!, <Function>calculate_or_initial_value, maybe_initial_value];

    const is_async = args ? calculator.length > 2 : calculator.length > 1;

    return readable<DynamicResolved<R>>(
        trigger,
        initial_value!,
        ({ set, update, invalidate, revalidate }) => {
            type Value = DynamicResolved<unknown>;
            type Subscription = [Unsubscriber, undefined | Value];
            const subscriptions = new Map<DynamicReadable<unknown>, Subscription>();
            const pending = new Set<DynamicReadable<unknown>>();
            const used = new Set<DynamicReadable<unknown>>();

            let tracked_dependencies: DynamicDependents | undefined;

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
                            cacheValue = (value && typeof value === 'object' && (('error' in value) || ('value' in value)))
                                ? value
                                : { value: value };

                            if (cache)
                                cache[1] = cacheValue;

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

                    if (!cacheValue!)
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

            const store_dependencies = () => {
                if (used.size === 0)
                    tracked_dependencies = undefined;
                else
                if (tracked_dependencies?.size !== used.size)
                    tracked_dependencies = new Set(used.keys());

                return tracked_dependencies;
            }

            const local_set = (value: DynamicResolved<R>) => {
                const dependencies = store_dependencies();

                set(Object.assign({}, value, { dependencies }));
            }

            const local_update = (updater: Updater<DynamicResolved<R>>) => {
                const dependencies = store_dependencies();

                update(value => {
                    try {
                        return Object.assign({}, updater(value), { dependencies });
                    }
                    catch (error) {
                        return { error, dependencies }
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

            let cleanup = noop;

            const params = args
                ? (
                    is_async
                    ? [args, complex_resolve, complex_set]
                    : [args, complex_resolve]
                )
                : (
                    is_async
                    ? [complex_resolve, complex_set]
                    : [complex_resolve]
                );

            const execute = (): Dynamic<R> | Unsubscriber | void => {
                try {
                    return calculator(...params);
                }
                catch (ex) {
                    return { error: ex, dependencies: store_dependencies() };
                }
            }

            const sync = () => {
                if (pending.size)
                    return;

                cleanup();
                cleanup = noop;
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

                const dependencies = store_dependencies();

                used.clear();

                if (result === undefined) {
                    if (!is_async)
                        set({ error: new Error('invalid result type'), dependencies });
                }
                else
                if (typeof result === 'function') {
                    if (is_async)
                        cleanup = result;
                    else
                        set({ error: new Error('invalid result type'), dependencies });
                }
                else
                if ('error' in result || 'value' in result) {
                    set(Object.assign({}, result, { dependencies }));
                }
                else {
                    cleanup = result.subscribe(
                        (value) => {
                            set(Object.assign({}, value, { dependencies }));
                        },
                        invalidate,
                        revalidate
                    );
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
                cleanup();
                cleanup = noop;
            }

            sync();

            return stop;
        }
    );
}
