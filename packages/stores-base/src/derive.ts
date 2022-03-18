import {Readable, Trigger, Unsubscriber} from "./types";
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
 * Creates a derived value store by synchronizing one or more readable stores and applying an aggregate function over
 * the store values.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param stores input stores
 * @param fn callback that aggregates the store values
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<S extends Stores, T>(
    trigger: Trigger<T>,
    stores: S,
    fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
    initial_value?: T
): Readable<T>;

/**
 * Creates a derived value store by synchronizing one or more readable stores and applying an aggregate function over
 * the store values.
 *
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

/**
 * Creates a derived value store by synchronizing one or more readable stores and applying an aggregate function over
 * the store values.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param stores input stores
 * @param fn callback that aggregates the store values
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<T>(trigger: Trigger<T>, stores: Stores, fn: Function, initial_value?: T): Readable<T> {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores as Readable<any>]
        : stores as Array<Readable<any>>;

    const auto = fn.length < 2;

    return readable<T>(trigger, initial_value!, (set, invalidate) => {
        let initiated = false;
        const values: unknown[] = [];

        let pending = create_pending(stores_array.length);
        let cleanup = noop;

        const sync = () => {
            if (pending.pending()) {
                return;
            }
            cleanup();
            const result: unknown = fn(single ? values[0] : values, set);
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
