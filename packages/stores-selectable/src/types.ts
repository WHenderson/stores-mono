import {Readable, Writable} from "@crikey/stores-base";

export type Selectable<T, S extends Readable<any>> =
    S &
    SelectablePath &
    (
        S extends Writable<any>
        ? (
            SelectableSelect<T, Writable<T>> &
            (undefined extends T ? SelectableDelete : {})
        )
        : SelectableSelect<T, Readable<T>>
    );

export type ReadOrWrite<T, S extends Readable<any>> = (
    S extends Writable<any>
    ? Writable<T>
    : Readable<T>
);

export interface SelectableSelect<T, S extends Readable<T>> {
    /**
     * Select child element/member based on selector callback and wrap it in a Writable or Readable store depending on
     * the source store.
     * @param selector callback which takes a (proxy) to the store value and returns a child selected from it
     */
    select<D>(this: void, selector: (v: T) => D): Selectable<D, ReadOrWrite<D,S>>;

    /**
     * Select child element/member based on the specified property and wrap it in a Writable or Readable store depending on
     * the source store.
     * @param property member/element to select from the store
     */
    select<D = any>(this: void, property: PropertyKey): Selectable<D, ReadOrWrite<D,S>>;

    /**
     * Select child element/member based on the specified path and wrap it in a Writable or Readable store depending on
     * the source store.
     * @param path member/element to select from the store
     * @param relative if provided, path is relative to the current path minus the specified number of segments
     * otherwise it is absolute to the root store value
     */
    select<D = any>(this: void, path: PropertyKey[], relative?: number | undefined): Selectable<D, ReadOrWrite<D,S>>;
}

export interface SelectableDelete {
    delete(this:void): void;
}

export interface SelectablePath {
    readonly path: readonly PropertyKey[];
}


/** Callback used to traverse root using path and return the final node */
export type TraverseGet<T> = (root: T, path: readonly PropertyKey[]) => any;

/** Callback used to traverse root using path and update the final node using a callback */
export type TraverseUpdate<T> = <U>(root: T, path: readonly PropertyKey[], update: (old_value: any) => U) => T;

/** Callback used to traverse root using path and delete/set undefined the final leaf node */
export type TraverseDelete<T> = (root: T, path: readonly PropertyKey[]) => T;

export type ResolveSelector = <T,R>(selector: (root: T) => R) => PropertyKey[];
