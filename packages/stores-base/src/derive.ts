import {ComplexSet, Readable, Trigger, Unsubscriber} from "./types";
import {create_pending} from "./create-pending";
import {noop} from "./noop";
import {readable} from "./readable";

/** One or more `Readable`s. */
export type Stores = Readable<unknown> | [Readable<unknown>, ...Array<Readable<unknown>>] | Array<Readable<unknown>>;

/** One or more values from `Readable` stores. */
export type StoresValues<T> = T extends Readable<infer U> ? U :
    { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

/** Synchronous callback for deriving a value from resolved input stores */
export type DeriveFnSync<S extends Stores,T> = (values: StoresValues<S>) => T;

/** Asynchronous callback for deriving a value from resolved input stores */
export type DeriveFnAsyncComplex<S extends Stores,T> =
    ((values: StoresValues<S>, set: ComplexSet<T>) => Unsubscriber | void);

/**
 * Derives a store from one or more other stores. The store value is calculated on demand and recalculated whenever any of
 * the store dependencies change.
 *
 * For simple synchronous usage, see the alternate signature.
 *
 * Values may be updated asynchronously:
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/derive.test.ts#example-derive-async-update}
 *
 * @category Create Store
 * @param trigger callback used to determine if subscribers should be called
 * @param stores input stores
 * @param fn callback that aggregates the store values which are passed in as the first argument
 */
export function derive<S extends Stores, T>(
    trigger: Trigger<T>,
    stores: S,
    fn: DeriveFnAsyncComplex<S,T | undefined>
): Readable<T | undefined>;

/**
 * Derives a store from one or more other stores. The store value is calculated on demand and recalculated whenever any of
 * the store dependencies change.
 *
 * For simple synchronous usage, see the alternate signature.
 *
 * Values may be updated asynchronously:
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/derive.test.ts#example-derive-async-update}
 *
 * @category Create Store
 * @param trigger callback used to determine if subscribers should be called
 * @param stores input stores
 * @param fn callback that aggregates the store values which are passed in as the first argument
 * @param initial_value initial value
 */
export function derive<S extends Stores, T>(
    trigger: Trigger<T>,
    stores: S,
    fn: DeriveFnAsyncComplex<S,T>,
    initial_value: T
): Readable<T>;

/**
 * Derives a store from one or more other stores. The store value is calculated on demand and recalculated whenever any of
 * the store dependencies change.
 *
 * In the simplest version, `derive` takes a single store, and the callback returns a derived value:
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/derive.test.ts#example-derive-simple-single}
 *
 * `derive` may also take a tuple or array of inputs a derive a value from those:
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/derive.test.ts#example-derive-simple-add}
 *
 * Alternate signatures provide a means for deriving the value asynchronously.
 *
 * @category Create Store
 * @param trigger callback used to determine if subscribers should be called
 * @param stores input stores
 * @param fn callback that aggregates the store values
 */
export function derive<S extends Stores, T>(
    trigger: Trigger<T>,
    stores: S,
    fn: DeriveFnSync<S,T>
): Readable<T>;

export function derive<T>(
    trigger: Trigger<T>,
    stores: Stores,
    fn: Function,
    initial_value?: T
): Readable<T> {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores as Readable<unknown>]
        : stores as Array<Readable<unknown>>;

    const auto = fn.length < 2;

    return readable<T>(trigger, initial_value!, (complexSet) => {
        const {set, invalidate} = complexSet;

        let initiated = false;
        const values: unknown[] = [];

        let pending = create_pending(stores_array.length);
        let cleanup = noop;
        let changed = false;

        const sync = () => {
            if (!changed || pending.is_dirty()) {
                return;
            }
            changed = false;
            cleanup();
            const result: unknown = fn(single ? values[0] : values, complexSet);
            if (auto) {
                set(result as T);
            } else {
                cleanup = typeof result === 'function' ? result as Unsubscriber : noop;
            }
        };

        const unsubscribers = stores_array.map((store, i) => store.subscribe(
            // changed
            (value: unknown) => {
                values[i] = value;
                changed = true;
                pending.validate(i);
                if (initiated) {
                    sync();
                }
            },
            // invalidated
            () => {
                pending.invalidate(i);
                invalidate();
            },
            // revalidated
            () => {
                pending.validate(i);
                if (initiated) {
                    sync();
                }
            }
        ));

        function stop() {
            unsubscribers.forEach(
                unsubscriber =>
                    unsubscriber()
            );
            cleanup();
        }

        initiated = true;

        try {
            sync();
        }
        catch (ex) {
            stop();
            throw ex;
        }

        return stop;
    });
}
