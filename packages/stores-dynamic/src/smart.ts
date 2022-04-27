import {Dynamic, DynamicError, DynamicResolved, DynamicValue} from "./types";
import {get} from "@crikey/stores-base";
import {is_dynamic_resolved} from "./is-dynamic-resolved";

/**
 * Returns item unchanged
 *
 * See alternate signatures for the real utility of this function
 *
 * @param item
 */
export function smart(item: DynamicError): DynamicError;

/**
 * Returns item unchanged
 *
 * See alternate signatures for the real utility of this function
 *
 * @param item
 */
export function smart<R>(item: DynamicValue<R>): DynamicValue<R>;

/**
 * Returns item unchanged
 *
 * See alternate signatures for the real utility of this function
 *
 * @param item
 */
export function smart<R>(item: DynamicResolved<R>): DynamicResolved<R>;

/**
 * Resolve store to a constant {@link DynamicResolved} value (on demand) if possible, or keep as a {@link DynamicReadable}.
 *
 * If item is not a store, returns the item unchanged.
 *
 * If item is a store:
 * Upon initial introspection, the store is subscribed. If the resulting value is is static
 * then it is cached, otherwise the store is cached.
 * Future introspections operate solely on the cache.
 *
 * The net result is that values that can be calculated statically are only calculated once, but values which
 * are calculated based off of dynamic dependencies will need to be calculated again upon subsequent subscriptions.
 * Thus, for a single subscription the dynamic value will be calculated at least twice.
 *
 * @param item
 */
export function smart<R>(item: Dynamic<R>): Dynamic<R>;

export function smart<R>(store: Dynamic<R>): Dynamic<R>  {
    if (is_dynamic_resolved(store))
        return store;

    const cache: Dynamic<R> = <any>{ };

    let resolve: (() => void) | null = () => {
        const result = get(store);

        Object.assign(
            cache,
            result.is_const
            ? result
            : store
        );

        resolve = null;
    }

    return new Proxy<Dynamic<R>>(
        cache,
        {
            has(target: Dynamic<R>, p: string | symbol): boolean {
                resolve?.();
                return Reflect.has(target, p);
            },

            get(target: Dynamic<R>, p: string | symbol, receiver: any): any {
                resolve?.();
                return Reflect.get(target, p, receiver);
            },

            getOwnPropertyDescriptor(target: Dynamic<R>, p: string | symbol): PropertyDescriptor | undefined {
                resolve?.();
                return Reflect.getOwnPropertyDescriptor(target, p);
            },

            ownKeys(target: Dynamic<R>): ArrayLike<string | symbol> {
                resolve?.();
                return Reflect.ownKeys(target);
            }
        }
    );
}
