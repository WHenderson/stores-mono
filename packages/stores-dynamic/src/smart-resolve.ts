import {Dynamic, DynamicReadable} from "./types";
import {get} from "@crikey/stores-base";

/**
 * Resolve store to a static value if it has no dynamic dependencies, or keep as a store.
 *
 * Upon initial introspection, the store is resolved. If the resolved value is static and indicates no dependencies
 * then the resolved value is cached otherwise the original store is cached.
 * Future introspections operate solely on the cache.
 *
 * The net result is that values that can be calculated statically are only calculated once, but values which
 * are calculated based off of dynamic dependencies will need to be calculated again upon their first subscription.
 * Thus, for a single subscription the dynamic value will be calculated at least twice.
 *
 * @param store
 */
export function smart_resolve<R>(store: DynamicReadable<R>): Dynamic<R>  {
    const cache = <Dynamic<R>>{};

    let resolvedCached: Dynamic<R> | undefined;
    function resolve(): Dynamic<R> {
        if (resolvedCached)
            return resolvedCached;

        const resolved = get(store);

        resolvedCached = resolved?.dependencies?.size ? store : resolved;
        return resolvedCached;
    }

    return new Proxy<Dynamic<R>>(
        cache,
        {
            has(_target: Dynamic<R>, p: string | symbol): boolean {
                const resolved = resolve();
                return Reflect.has(resolved, p);
            },

            get(_target: Dynamic<R>, p: string | symbol, receiver: any): any {
                const resolved = resolve();
                return Reflect.get(resolved, p, receiver);
            },

            getOwnPropertyDescriptor(_target: Dynamic<R>, p: string | symbol): PropertyDescriptor | undefined {
                const resolved = resolve();
                return Reflect.getOwnPropertyDescriptor(resolved, p);
            },

            ownKeys(_target: Dynamic<R>): ArrayLike<string | symbol> {
                const resolved = resolve();
                return Reflect.ownKeys(resolved);
            }
        }
    );
}
