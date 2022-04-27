import {DynamicReadable} from "./types";
import {constant} from "./constant";

/**
 * Create a simple store which always returns the same result - a {@link DynamicError} containing error.
 *
 * _Example_:
 * {@codeblock ../stores-dynamic/examples/constant.test.ts#example-constant-error}
 *
 * @category Create Store
 * @param value the constant value of the store
 */
export function constant_error<T = unknown>(error: any): DynamicReadable<T> {
    return constant({ error });
}
