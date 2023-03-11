import {isDraft as _isDraft} from "mutative";

export function isDraft<T,O extends object>(value: T | O): value is O {
    return _isDraft(value);
}


