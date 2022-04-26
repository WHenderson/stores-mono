import {DynamicReadable} from "./types";
import {constant} from "./constant";

export function constant_value<T>(value: T): DynamicReadable<T> {
    return constant({ value });
}
