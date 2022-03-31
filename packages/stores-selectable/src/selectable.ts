import {derive, is_writable, Readable, Trigger, Writable} from "@crikey/stores-base";
import {ReadOrWrite, ResolveSelector, Selectable, TraverseDelete, TraverseGet, TraverseUpdate} from "./types";
import {traverse_get} from "./traverse-get";
import {traverse_update} from "./traverse-update";
import {traverse_delete} from "./traverse-delete";
import {resolve_selector} from "./resolve-selector";
import {trigger_strict_not_equal} from "@crikey/stores-base/src";

export interface SelectableOptions<T, P> {
    /**
     * Callback used when performing a readonly traversal
     */
    traverse_get: TraverseGet<T, P>;

    /**
     * Callback used when upserting a value
     */
    traverse_update: TraverseUpdate<T, P>;

    /**
     * Callback used when deleting a value
     */
    traverse_delete: TraverseDelete<T, P>;

    /**
     * Callback used when converting a selector into a path
     */
    resolve_selector: ResolveSelector<P>;

    /**
     * Trigger to use for comparing derived store values
     */
    trigger: Trigger<any>;
}

const default_options: SelectableOptions<any, PropertyKey> = {
    traverse_get,
    traverse_update,
    traverse_delete,
    resolve_selector,
    trigger: trigger_strict_not_equal
}

/**
 * Create a selectable {@link Selectable} store with custom pathing semantics.
 *
 * @param trigger comparison function used to determine when to propagate changes
 * @param store base store to add selection semantics to
 * @param options path resolution semantics
 */
export function selectable<T, S extends Readable<T>, P>(store: S & Readable<T>, options: SelectableOptions<T, P>): Selectable<T, S, P>;

/**
 * Create a selectable {@link Selectable} store with standard json pathing semantics.
 *
 * @param trigger comparison function used to determine when to propagate changes
 * @param store base store to add selection semantics to
 */
export function selectable<T, S extends Readable<T>>(store: S & Readable<T>): Selectable<T, S, PropertyKey>;

export function selectable<T, S extends Readable<T>, P>(store: S & Readable<T>, options?: SelectableOptions<T, P>): Selectable<T, S, P> {
    const readOnly: Readable<T> = store;
    const readWrite: Writable<T> = <Writable<T>><unknown>store;

    if (!options)
        options = <SelectableOptions<T,P>><unknown>default_options;

    const trigger = options.trigger;
    const traverse_get = options.traverse_get;
    const traverse_update = options.traverse_update;
    const traverse_delete = options.traverse_delete;
    const resolve_selector = options.resolve_selector;

    function select<D>(this:void, selector: (v: T) => D): Selectable<D,ReadOrWrite<D,S>, P>;
    function select<D>(this:void, segment: P & Exclude<P, Function> & Exclude<P, any[]>): Selectable<D,ReadOrWrite<D,S>, P>;
    function select<D>(this:void, absPath: P[], relative?: number | undefined): Selectable<D,ReadOrWrite<D,S>, P>;

    function select<D>(this:void, first: (P & Exclude<P, Function> & Exclude<P, any[]>) | P[] | ((v: T) => D), relative?: number): Selectable<D, ReadOrWrite<D,S>, P> {
        const rootPath: readonly P[] = (() => {
            if (typeof first === 'function')
                return resolve_selector(<(v: T) => D>first);

            if (!Array.isArray(first))
                return [first];

            if (relative !== undefined && relative !== 0)
                throw new RangeError(); // root path cannot be relative

            return first;
        })();

        const selectRo = (root: T): D =>
            <D>traverse_get(root, rootPath);

        const updateRw = (root: T, update: (old_value: D) => D): T =>
            traverse_update(root, rootPath, update);

        const deleteRw = (root: T): T =>
            traverse_delete(root, rootPath);

        // set the sub-store value
        function subSet(new_sub_value: D) {
            readWrite.update((old_root_value: T) => updateRw(old_root_value, () => new_sub_value));
        }

        // update the sub-store value
        function subUpdate(updater: (old_value: D) => D) {
            readWrite.update((old_root_value: T) => updateRw(old_root_value, old_sub_value => updater(old_sub_value)));
        }

        // update the sub-store value
        function subDelete() {
            readWrite.update((old_root_value: T) => deleteRw(old_root_value));
        }

        // subscribe
        const { subscribe: subSubscribe } = derive(
            trigger,
            readOnly,
            (new_root_value) => selectRo(new_root_value)
        );

        // create sub-sub-store
        function subSelect<V>(selector: (v: D) => V): Selectable<V,ReadOrWrite<V,S>, P>;
        function subSelect<V>(segment: P & Exclude<P, Function> & Exclude<P, any[]>): Selectable<V,ReadOrWrite<V,S>, P>;
        function subSelect<V>(path: P[], relative?: number | undefined): Selectable<V,ReadOrWrite<V,S>, P>;

        function subSelect<V>(first: (P & Exclude<P, Function> & Exclude<P, any[]>) | P[] | ((v: D) => V), relative?: number): Selectable<V,ReadOrWrite<V,S>, P> {
            const subPath = (() => {
                if (typeof first === 'function')
                    return [...rootPath, ...resolve_selector(<(v: D) => V>first)];

                if (!Array.isArray(first))
                    return [...rootPath, first];

                if (relative !== undefined && (
                    relative < 0 ||
                    !Number.isSafeInteger(relative) ||
                    relative > rootPath.length
                ))
                    throw new RangeError();

                return [...rootPath.slice(0, rootPath.length - (relative ?? rootPath.length)), ...first];
            })();

            return select<V>(subPath);
        }

        const selectableStore = is_writable(store)
        ? {
            set: subSet,
            update: subUpdate,
            // always included for writable stores, but may be hidden by typescript if the type cannot be made undefined
            delete: subDelete,
            subscribe: subSubscribe,
            select: subSelect,
            path: rootPath
        }
        : {
            subscribe: subSubscribe,
            select: subSelect,
            path: rootPath
        };

        return <Selectable<D, ReadOrWrite<D,S>, P>><unknown>selectableStore;
    }

    function delete_(this:void) {
        readWrite.set(<never>undefined);
    }

    const selectableStore = is_writable(store)
    ? {
        ...store,
        select,
        path: <readonly PropertyKey[]>[],
        // always included for writable stores, but may be hidden by typescript if the type cannot be made undefined
        delete: delete_
    }
    : {
        ...store,
        select,
        path: <readonly PropertyKey[]>[],
    };

    return <Selectable<T,S, P>><unknown>selectableStore;
}

selectable.default_options = default_options;
