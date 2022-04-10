import {Readable, Writable} from "@crikey/stores-base";

/**
 * Extends an existing store with select semantics.
 *
 * {@link Readable} stores are extended with {@link SelectablePath} and {@link SelectableSelect}.
 *
 * {@link Writable} stores are additionally extended with {@link SelectableDelete} if their value can be set to
 * `undefined`.
 */
export type Selectable<T, S extends Readable<unknown>, P> =
    S &
    SelectablePath<P> &
    (
        S extends Writable<any>
        ? (
            SelectableSelect<T, Writable<T>, P> &
            (undefined extends T ? SelectableDelete : {})
        )
        : SelectableSelect<T, Readable<T>, P>
    );

export type ReadOrWrite<T, S extends Readable<unknown>> = (
    S extends Writable<any>
    ? Writable<T>
    : Readable<T>
);

export interface SelectableSelect<T, S extends Readable<T>, P> {
    /**
     * Select child element/member based on selector callback and wrap it in a Writable or Readable store depending on
     * the source store.
     * @param selector callback which takes a (proxy) to the store value and returns a child selected from it
     */
    select<D>(this: void, selector: (v: T) => D): Selectable<D, ReadOrWrite<D,S>, P>;

    /**
     * Select child element/member based on the specified property and wrap it in a Writable or Readable store depending on
     * the source store.
     * @param property member/element to select from the store
     */
    select<D = unknown>(this: void, property: P): Selectable<D, ReadOrWrite<D,S>, P>;

    /**
     * Select child element/member based on the specified path and wrap it in a Writable or Readable store depending on
     * the source store.
     * @param path member/element to select from the store
     * @param relative if provided, path is relative to the current path minus the specified number of segments
     * otherwise it is absolute to the root store value
     */
    select<D = unknown>(this: void, path: P[], relative?: number | undefined): Selectable<D, ReadOrWrite<D,S>, P>;
}

export interface SelectableDelete {
    /**
     * Delete the store value from its parent, or in the case of a root item, set it to undefined
     */
    delete(this:void): void;
}

export interface SelectablePath<P> {
    /**
     * The full path of this node, relative to the original {@link selectable} that created it
     */
    readonly path: readonly P[];
}

/** Callback used to traverse root using path and return the final node */
export type TraverseGet<T, P> = (root: T, path: readonly P[]) => unknown;

/** Callback used to traverse root using path and update the final node using a callback */
export type TraverseUpdate<T, P> = <U>(root: T, path: readonly P[], update: (old_value: any) => U) => T;

/** Callback used to traverse root using path and delete/set undefined the final leaf node */
export type TraverseDelete<T, P> = (root: T, path: readonly P[]) => T;

/** Callback used to resolve a selector into a path */
export type ResolveSelector<P> = <T, R>(selector: (root: T) => R) => P[];
