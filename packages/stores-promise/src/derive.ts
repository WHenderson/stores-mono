import {derive as baseDerive, Readable, Set, Stores, StoresValues, trigger_strict_not_equal} from "@crikey/stores-base";
import {Stateful} from "./types";
import {readable} from "./readable";

export type PromiseCreator<S extends Stores,T> = (values: StoresValues<S>) => Promise<T>;

export function derive<S extends Readable<any>, T>(
    stores: S,
    creator: PromiseCreator<S, T>,
    initial_value?: T
): Readable<Stateful<T>>;

export function derive<S extends [Readable<any>, ...Array<Readable<any>>], T>(
    stores: S,
    creator: PromiseCreator<S, T>,
    initial_value?: T
): Readable<Stateful<T>>;

export function derive<S extends Array<Readable<any>>, T>(
    stores: S,
    creator: PromiseCreator<S, T>,
    initial_value?: T
): Readable<Stateful<T>>;

export function derive<S extends Stores, T>(
    stores: S,
    creator: PromiseCreator<S, T>,
    initial_value?: T
): Readable<Stateful<T>> {
    return baseDerive(
        trigger_strict_not_equal,
        stores,
        (value, set: Set<Stateful<T>>) => {
            return readable(creator(value), initial_value).subscribe(set);
        },
        <Stateful<T>>undefined!
    );
}
