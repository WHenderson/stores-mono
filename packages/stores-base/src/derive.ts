import {Readable, Set, Trigger, Unsubscriber, Update} from "./types";
import {create_pending} from "./create-pending";
import {noop} from "./noop";
import {readable} from "./readable";

/** One or more `Readable`s. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

/** One or more values from `Readable` stores. */
export type StoresValues<T> = T extends Readable<infer U> ? U :
    { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

/**
 * Derives a store from one or more other stores. The store value is calculated on demand and recalculated whenever any of
 * the store dependencies change.
 *
 * For simple usage, see the alternate signature.
 *
 * Values may be derived asynchronously:
 *
 * _Example_:
 * {@codeblock ../examples/derive.test.ts#example-derive-async-simple}
 *
 * Values may be updated asynchronously:
 *
 * _Example_:
 * {@codeblock ../examples/derive.test.ts#example-derive-async-update}
 *
 * @category Create Store
 * @param trigger callback used to determine if subscribers should be called
 * @param stores input stores
 * @param fn callback that aggregates the store values which are passed in as the first argument
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<S extends Stores, T>(
    trigger: Trigger<T>,
    stores: S,
    fn: (values: StoresValues<S>, set: Set<T>, update: Update<T>) => Unsubscriber | void,
    initial_value?: T
): Readable<T>;

/**
 * Derives a store from one or more other stores. The store value is calculated on demand and recalculated whenever any of
 * the store dependencies change.
 *
 * In the simplest version, `derive` takes a single store, and the callback returns a derived value:
 *
 * _Example_:
 * {@codeblock ../examples/derive.test.ts#example-derive-simple-single}
 *
 * `derive` may also take a tuple or array of inputs a derive a value from those:
 *
 * _Example_:
 * {@codeblock ../examples/derive.test.ts#example-derive-simple-multiple}
 *
 * Alternate signatures provide a means for deriving the value asynchronously.
 *
 * @category Create Store
 * @param trigger callback used to determine if subscribers should be called
 * @param stores input stores
 * @param fn callback that aggregates the store values
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<S extends Stores, T>(
    trigger: Trigger<T>,
    stores: S,
    fn: (values: StoresValues<S>) => T,
    initial_value?: T
): Readable<T>;

export function derive<T>(trigger: Trigger<T>, stores: Stores, fn: Function, initial_value?: T): Readable<T> {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores as Readable<any>]
        : stores as Array<Readable<any>>;

    const auto = fn.length < 2;

    return readable<T>(trigger, initial_value!, (set, update, invalidate) => {
        let initiated = false;
        const values: unknown[] = [];

        let pending = create_pending(stores_array.length);
        let cleanup = noop;

        const sync = () => {
            if (pending.is_dirty()) {
                return;
            }
            cleanup();
            const result: unknown = fn(single ? values[0] : values, set, update);
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
