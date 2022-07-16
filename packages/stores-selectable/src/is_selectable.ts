import {Readable} from "@crikey/stores-base";
import {Selectable, SelectableDelete, SelectablePath, SelectableSelect} from "./types";
import {Writable} from "@crikey/stores-base/src";

export function is_selectable<T = unknown, P = unknown>(writable: Writable<T>): writable is Writable<T> & SelectablePath<P> & SelectableSelect<T, Writable<T>, P> & SelectableDelete;
export function is_selectable<T = unknown, P = unknown>(readable: Readable<T>): readable is Readable<T> & SelectablePath<P> & SelectableSelect<T, Readable<T>, P>;

export function is_selectable<T = unknown>(store: Readable<T> | Writable<T>): boolean {
    return 'path' in store && 'select' in store;
}
