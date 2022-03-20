import {Dynamic, DynamicDependents, DynamicReadable, DynamicResolved} from "./types";
import {readable, Trigger} from "@crikey/stores-base";
import {noop, Readable, Unsubscriber} from "@crikey/stores-base/src";

export type ResolveDynamic = <V>(arg: Dynamic<V> | Readable<V>) => V;

export type Inputs = [any, ...any[]] | Array<any>; // Prioritise tuple type

export type CalculatorWithoutArgs<R> = (resolve: ResolveDynamic) => Dynamic<R>;
export type CalculatorWithArgs<A extends Inputs, R> = (resolve: ResolveDynamic, ...args: A) => Dynamic<R>;

export function dynamic<A extends [any, ...any[]], R>(
    trigger: Trigger<Dynamic<R>>,
    args: A,
    calculate: CalculatorWithArgs<A, R>,
    initial_value?: DynamicResolved<R>)
: DynamicReadable<R>;

export function dynamic<A extends Array<any>, R>(
    trigger: Trigger<Dynamic<R>>,
    args: A,
    calculate: CalculatorWithArgs<A, R>,
    initial_value?: DynamicResolved<R>)
    : DynamicReadable<R>;

export function dynamic<R>(
    trigger: Trigger<Dynamic<R>>,
    calculate: CalculatorWithoutArgs<R>,
    initial_value?: DynamicResolved<R>)
: DynamicReadable<R>;

export function dynamic<A extends Inputs, R>(
    trigger: Trigger<Dynamic<R>>,
    args_or_calculator: A | CalculatorWithoutArgs<R>,
    calculate_or_initial_value?: CalculatorWithArgs<A, R> | DynamicResolved<R>,
    maybe_initial_value?: DynamicResolved<R>)
: DynamicReadable<R> {
    const [args, calculator, initial_value] =
        (typeof args_or_calculator === 'function')
        ? [<unknown[]>[], args_or_calculator, <DynamicResolved<R> | undefined>calculate_or_initial_value]
        : [args_or_calculator, <CalculatorWithArgs<A, R>>calculate_or_initial_value, maybe_initial_value];

    return readable<DynamicResolved<R>>(
        trigger,
        initial_value!,
        (set, _update, invalidate, revalidate) => {
            type Value = DynamicResolved<unknown>;
            type Subscription = [Unsubscriber, undefined | Value];
            const subscriptions = new Map<Readable<any>, Subscription>();
            const pending = new Set<Readable<any>>();
            const used = new Set<Dynamic<any> | Readable<any>>();

            let dependencies: DynamicDependents | undefined;

            function resolve<V>(arg: Dynamic<V> | Readable<V>): V {
                used.add(arg);

                if ('error' in arg)
                    throw arg.error;
                if ('value' in arg)
                    return arg.value;

                let cache = subscriptions.get(arg);
                let cacheValue: Value | undefined = cache?.[1];

                if (!cache) {
                    dependencies = undefined;

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

            let cleanup = noop;

            const execute = () => {
                try {
                    return calculator(resolve, ...<any>args);
                }
                catch (ex) {
                    return { error: ex };
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

                if (!dependencies && used.size)
                    dependencies = new Set(used.keys());

                used.clear();

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

            sync();

            return function stop() {
                subscriptions.forEach(([unsubscribe,]) => unsubscribe());
                subscriptions.clear();
                pending.clear();
                used.clear();
                cleanup();
                cleanup = noop;
            }
        }
    );
}
