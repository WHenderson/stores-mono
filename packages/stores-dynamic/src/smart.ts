import {Dynamic, DynamicDependents, DynamicReadable, DynamicResolved} from "./types";
import {ComplexSet, create_pending, noop, readable, Trigger, Unsubscriber} from "@crikey/stores-base";
import {ComplexResolveDynamic, DeriveFn} from "./dynamic";
import {Updater} from "@crikey/stores-base/src";

export type ResolvedInputs = [DynamicResolved<unknown>, ...DynamicResolved<unknown>[]] | Array<DynamicResolved<unknown>>; // Prioritise tuple type
export type DynamicInputs = [Dynamic<unknown>, ...Dynamic<unknown>[]] | Array<Dynamic<unknown>>; // Prioritise tuple type

export type StoresValues<A> =
    { [K in keyof A]: A[K] extends DynamicReadable<infer U> ? DynamicResolved<U> : A[K] };

export type ResolveResolved = <V>(arg: DynamicResolved<V>) => V;

export type ComplexResolveResolved = ResolveResolved & { resolve: ResolveResolved };

export function smart<R>(
    trigger: Trigger<DynamicResolved<R>>,
    calc: DeriveFn<never, DynamicResolved<R>, ComplexResolveResolved, never>,
    initial_value?: DynamicResolved<R>
) : DynamicResolved<R>;

export function smart<R>(
    trigger: Trigger<DynamicResolved<R>>,
    calc: DeriveFn<never, Dynamic<R>, ComplexResolveDynamic, ComplexSet<R>>,
    initial_value?: DynamicResolved<R>
) : DynamicReadable<R | undefined>;

export function smart<R>(
    trigger: Trigger<DynamicResolved<R>>,
    calc: DeriveFn<never, Dynamic<R>, ComplexResolveResolved, ComplexSet<R>>,
    initial_value: DynamicResolved<R>
) : DynamicReadable<R>;

export function smart<A extends ResolvedInputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args: A,
    calc: DeriveFn<A, DynamicResolved<R>, ComplexResolveResolved, never>,
    initial_value?: DynamicResolved<R>
) : DynamicResolved<R>;

export function smart<A extends DynamicInputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args: A,
    calc: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, never>
) : Dynamic<R | undefined>;

export function smart<A extends DynamicInputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args: A,
    calc: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, never>,
    initial_value: DynamicResolved<R>
) : Dynamic<R>;

export function smart<A extends DynamicInputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args: A,
    calc: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, ComplexSet<R>>
) : DynamicReadable<R | undefined>;

export function smart<A extends DynamicInputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args: A,
    calc: DeriveFn<A, Dynamic<R>, ComplexResolveDynamic, ComplexSet<R>>,
    initial_value: DynamicResolved<R>
) : DynamicReadable<R>;

export function smart<A extends DynamicInputs, R>(
    trigger: Trigger<DynamicResolved<R>>,
    args_or_calc: A | Function,
    maybe_initial_value_or_calc?: DynamicResolved<R> | Function,
    maybe_initial_value?: DynamicResolved<R>
) : Dynamic<R> {
    const [args, calc, initial_value] = typeof args_or_calc === 'function'
    ? [undefined, args_or_calc, <DynamicResolved<R>>maybe_initial_value_or_calc]
    : [args_or_calc, <Function>maybe_initial_value_or_calc, maybe_initial_value!];

    const is_async = args ? calc.length > 2 : calc.length > 1;

    function resolve_static<T>(resolved: DynamicResolved<T>): T {
        if ('error' in resolved)
            throw resolved.error;
        if (!('value' in resolved))
            throw new Error('expected resolved value');

        return resolved.value;
    }

    if (!is_async && (!args || !args.some(arg => 'subscribe' in arg))) {
        const local_resolve = resolve_static;
        const complex_resolve = Object.assign(
            <T>(resolved: DynamicResolved<T>) => resolve_static(resolved),
            { resolve: local_resolve }
        );

        try {
            return Object.assign(
                {},
                args
                ? calc(args, complex_resolve)
                : calc(complex_resolve),
                { is_static: true }
            );
        }
        catch (ex) {
            return { error: ex, is_static: true };
        }
    }

    return readable<DynamicResolved<R>>(
        trigger,
        initial_value,
        ({ set, update, invalidate, revalidate }) => {
            const stores_map = new Map<DynamicReadable<unknown>, number>();
            const used = new Set<DynamicReadable<unknown>>();
            const subscriptions = new Map<DynamicReadable<unknown>, Unsubscriber>();
            const values: DynamicResolved<unknown>[] = [];
            const pending = create_pending(stores_map.size);

            let tracked_dependencies: DynamicDependents | undefined;

            args?.forEach((arg, i) => {
                if ('subscribe' in arg)
                    stores_map.set(arg, i);
                else
                    values[i] = arg;
            });

            const local_resolve = <V>(arg: Dynamic<V>) : V => {
                if ('subscribe' in arg) {
                    const index = stores_map.get(arg);
                    if (index === undefined)
                        throw new Error('Can only resolve explicitly listed Readables');

                    used.add(arg);

                    const cached = subscriptions.get(arg);

                    if (!cached) {
                        let initialised = false;

                        const unsubscribe = arg.subscribe(
                            (value) => {
                                values[index] = value;
                                pending.validate(index);
                                if (initialised)
                                    sync();
                            },
                            () => {
                                pending.invalidate(index);
                                invalidate();
                            },
                            () => {
                                pending.validate(index);
                                if (initialised)
                                    sync();
                            }
                        );

                        if (!values[index])
                            throw new ReferenceError('store did not satisfy contract');

                        subscriptions.set(arg, unsubscribe);

                        initialised = true;
                    }

                    return <V>resolve_static(values[index]);
                }

                return resolve_static(arg);
            }

            const complex_resolve = Object.assign(
                <V>(arg: Dynamic<V>) : V => local_resolve(arg),
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

                set(Object.assign({}, value, { dependencies, is_static: false }));
            }

            const local_update = (updater: Updater<DynamicResolved<R>>) => {
                const dependencies = store_dependencies();

                update(value => {
                    try {
                        return Object.assign({}, updater(value), { dependencies, is_static: false });
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
                    return calc(...params);
                }
                catch (ex) {
                    return { error: ex, dependencies: store_dependencies() };
                }
            }

            const sync = () => {
                if (pending.is_dirty())
                    return;

                cleanup();
                cleanup = noop;
                used.clear();

                const result = execute();

                // unsubscribe from unused subscriptions
                subscriptions.forEach((unsubscribe, store) => {
                    if (!used.has(store)) {
                        unsubscribe();
                        subscriptions.delete(store);
                        const index = stores_map.get(store)!;
                        pending.validate(index);
                    }
                });

                const dependencies = store_dependencies();

                used.clear();

                const is_static = !is_async
                    && (!dependencies || [...dependencies.values()].every(store => {
                        const index = stores_map.get(store)!;
                        return values[index]?.is_static;
                    }));

                if (result === undefined) {
                    if (!is_async)
                        set({ error: new Error('invalid result type'), dependencies, is_static });
                }
                else
                if (typeof result === 'function') {
                    if (is_async)
                        cleanup = result;
                    else
                        set({ error: new Error('invalid result type'), dependencies, is_static });
                }
                else
                if ('error' in result || 'value' in result) {
                    set(Object.assign({}, result, { dependencies, is_static }));
                }
                else {
                    cleanup = result.subscribe(
                        (value) => {
                            set(Object.assign({}, value, { dependencies, is_static: false }));
                        },
                        invalidate,
                        revalidate
                    );
                }
            };

            const stop = () => {
                subscriptions.forEach(
                    (unsubscriber, store) => {
                        unsubscriber();
                        const index = stores_map.get(store)!;
                        pending.validate(index);
                    }
                );
                subscriptions.clear();
                cleanup();
            }

            sync();

            return stop;
        }
    );
}

