import {DynamicReadable} from "./types";
import {constant} from "./constant";

export function constant_error<T = unknown>(error: any): DynamicReadable<T> {
    return constant({ error });
}
