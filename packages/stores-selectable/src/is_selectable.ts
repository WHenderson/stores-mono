import {Readable} from "@crikey/stores-base";
import {Selectable} from "./types";
import {Writable} from "@crikey/stores-base";

export function is_selectable<T = unknown, P = unknown>(writable: Writable<T>): writable is Selectable<T, Writable<T>, P>;
export function is_selectable<T = unknown, P = unknown>(readable: Readable<T>): readable is Selectable<T, Readable<T>, P>;

export function is_selectable<T = unknown>(store: Readable<T> | Writable<T>): boolean {
    return 'path' in store && 'select' in store;
}
