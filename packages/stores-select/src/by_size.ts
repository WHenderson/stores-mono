import {ReadSelector} from "./types";

export function by_size<T extends { size: number }>(
): ReadSelector<T, number> {
    return {
        get(parent) {
            return parent.size;
        }
    }
}
