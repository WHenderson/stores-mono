import {Dynamic} from "./types";
import {is_dynamic_resolved} from "./is-dynamic-resolved";
import {is_dynamic_error} from "./is-dynamic-error";
import {get} from "@crikey/stores-base";

/**
 * Resolves the given {@link Dynamic} dynamic to its contained value, or throws its contained error
 *
 * @throws the contained error if present
 * @param dynamic
 */
export function resolve<T>(dynamic: Dynamic<T>): T {
    const resolved = is_dynamic_resolved(dynamic)
        ? dynamic
        : get(dynamic);

    if (is_dynamic_error(resolved))
        throw resolved.error;

    return resolved.value;
}
