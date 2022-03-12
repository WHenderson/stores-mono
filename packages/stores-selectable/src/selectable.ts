import {Readable, Stores, StoresValues, Unsubscriber, Writable} from "@crikey/stores-base";
import {TraverseGet, TraverseUpdate, ReadOrWrite, Selectable, TraverseDelete, ResolveSelector} from "./types";
import {traverse_get} from "./traverse-get";
import {traverse_update} from "./traverse-update";
import {traverse_delete} from "./traverse-delete";
import {resolve_selector} from "./resolve-selector";

export type DeriveCreator = {
    <S extends Stores, T>(
        stores: S,
        fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
        initial_value?: T
    ) : Readable<T>;

    <S extends Stores, T>(
        stores: S,
        fn: (values: StoresValues<S>) => T,
        initial_value?: T
    ) : Readable<T>;
}

function isWritable<T>(store: Readable<T> | Writable<T>): store is Writable<T> {
    return 'set' in store && 'update' in store;
}


export interface SelectableOptions<T> {
    traverse_get?: TraverseGet<T>;
    traverse_update?: TraverseUpdate<T>;
    traverse_delete?: TraverseDelete<T>;
    resolve_selector?: ResolveSelector;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function selectable<T, S extends Readable<T>>(store: S & Readable<T>, derive: DeriveCreator, options?: SelectableOptions<T>): Selectable<T,S> {
    const readOnly: Readable<T> = store;
    const readWrite: Writable<T> = <Writable<T>><unknown>store;

    const my_traverse_get = options?.traverse_get ?? traverse_get;
    const my_traverse_update = options?.traverse_update ?? traverse_update;
    const my_traverse_delete = options?.traverse_delete ?? traverse_delete;
    const my_resolve_selector = options?.resolve_selector ?? resolve_selector;

    function select<D>(this:void, selector: (v: T) => D): Selectable<D,ReadOrWrite<D,S>>;
    function select<D>(this:void, segment: PropertyKey): Selectable<D,ReadOrWrite<D,S>>;
    function select<D>(this:void, absPath: PropertyKey[], relative?: number | undefined): Selectable<D,ReadOrWrite<D,S>>;

    function select<D>(this:void, first: PropertyKey | PropertyKey[] | ((v: T) => D), relative?: number): Selectable<D, ReadOrWrite<D,S>> {
        const rootPath: readonly PropertyKey[] = (() => {
            if (typeof first === 'function')
                return my_resolve_selector(first);

            if (typeof first === 'number' || typeof first === 'string' || typeof first === 'symbol')
                return [first];

            if (relative !== undefined && relative !== 0)
                throw new RangeError(); // root path cannot be relative

            return first;
        })();

        const selectRo = (root: T): D =>
            <D>my_traverse_get(root, rootPath);

        const updateRw = (root: T, update: (old_value: D) => D): T =>
            my_traverse_update(root, rootPath, update);

        const deleteRw = (root: T): T =>
            my_traverse_delete(root, rootPath);

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
            readOnly,
            (new_root_value) => selectRo(new_root_value)
        );

        // create sub-sub-store
        function subSelect<V>(selector: (v: D) => V): Selectable<V,ReadOrWrite<V,S>>;
        function subSelect<V>(segment: PropertyKey): Selectable<V,ReadOrWrite<V,S>>;
        function subSelect<V>(path: PropertyKey[], relative?: number | undefined): Selectable<V,ReadOrWrite<V,S>>;

        function subSelect<V>(first: PropertyKey | PropertyKey[] | ((v: D) => V), relative?: number): Selectable<V,ReadOrWrite<V,S>> {
            const subPath = (() => {
                if (typeof first === 'function')
                    return [...rootPath, ...resolve_selector(first)];

                if (typeof first === 'number' || typeof first === 'string' || typeof first === 'symbol')
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

        const selectableStore = isWritable(store)
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

        return <Selectable<D, ReadOrWrite<D,S>>><unknown>selectableStore;
    }

    function delete_(this:void) {
        readWrite.set(<never>undefined);
    }

    const selectableStore = isWritable(store)
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

    return <Selectable<T,S>><unknown>selectableStore;
}