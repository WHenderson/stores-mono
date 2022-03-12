import {create_path_proxy, PathProxy, sym_path} from "./path-proxy";

/**
 * Returns the path generated by referencing root members and their children.
 *
 * Note that the root provided to the callback is only a proxy for finding paths and is not actually of the
 * typescript specified type.
 *
 * @returns path An array of members/elements which were used to select the returned member
 * @param selector callback which takes the root type and returns a leaf member
 */
export function resolve_selector<T,R>(selector: (root: T) => R): PropertyKey[] {
    return (<PathProxy<never>>selector(<T>create_path_proxy()))[sym_path];
}