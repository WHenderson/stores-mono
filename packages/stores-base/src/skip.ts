import {Subscriber} from "./types";

export function skip<T>(subscriber: Subscriber<T>) : Subscriber<T> {
    let first = true;
    return (value) => {
        if (first) {
            first = false;
            return;
        }

        subscriber(value);
    }
}
