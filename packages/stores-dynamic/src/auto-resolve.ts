import {Dynamic, DynamicReadable} from "./types";
import {get} from "@crikey/stores-base";

/**
 * Resolve store to a static value (on demand) if it has no dynamic dependencies, or keep as a store.
 *
 * Upon initial introspection, the store is subscribed. If the resulting value is is static
 * then it is cached, otherwise the store is cached.
 * Future introspections operate solely on the cache.
 *
 * The net result is that values that can be calculated statically are only calculated once, but values which
 * are calculated based off of dynamic dependencies will need to be calculated again upon subsequent subscriptions.
 * Thus, for a single subscription the dynamic value will be calculated at least twice.
 *
 * @param store
 */
export function auto_resolve<R>(store: DynamicReadable<R>): Dynamic<R>  {
    const cache: Dynamic<R> = <any>{ };

    let resolve: (() => void) | null = () => {
        const result = get(store);

        Object.assign(
            cache,
            result.is_static
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
