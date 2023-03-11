import {isDraftable as _isDraftable} from "mutative";

export function isDraftable<T,O extends object>(value: T | O): value is O {
    return _isDraftable(value);
}

