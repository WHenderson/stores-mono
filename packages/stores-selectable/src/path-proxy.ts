/* eslint-disable @typescript-eslint/no-unsafe-return,@typescript-eslint/ban-types */
/**
 * Symbol used as storage for finding the current proxy path
 */
export const sym_path = Symbol('details');

/**
 * A simple proxy type which emulates the T type with an added property for storing the path
 */
export type PathProxy<T> = {
    readonly [sym_path]: PropertyKey[];
} & (
    T extends object
        ? { [ P in keyof T]: PathProxy<T[P]> }
        : T
);

/**
 * Creates a {@link PathProxy} with the given path.
 * Referencing a member will return a new proxy with the member name concatenated to the path array.
 * Referencing {@link sym_path} will return the current proxy path.
 *
 * @param path the current path for the proxy
 */
export function create_path_proxy<T = any>(
    path: PropertyKey[] = []
) : PathProxy<T> {
    return <PathProxy<T>><unknown>new Proxy(
        {},
        {
            get(_target: never, p: string | symbol, _receiver: never) {
                if (p === sym_path)
                    return path;

                // Note: p is never left as a number by the Proxy, so we have to assume that a string which looks like a number /is/ a number.
                const prop = (typeof p === 'string' && /^(0|[1-9][0-9]*)$/.test(p) && Number.isSafeInteger(parseInt(p, 10)))
                    ? parseInt(p, 10)
                    : p;

                return create_path_proxy([...path, prop]);
            }
        }
    );
}
