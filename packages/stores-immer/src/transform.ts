import {writable} from "./writable";
import {derive} from "./index";
import {
    Action,
    ComplexSet, noop, read_only,
    Readable,
    skip,
    Unsubscriber,
    UpdaterAsync,
    UpdaterSync,
    Writable
} from "@crikey/stores-base/src";
import {finishDraft, isDraft} from "immer";

/** Synchronous callback for deriving a value from resolved input value */
export type ReadFnSync<I,O> = (values: I) => O;

/** Asynchronous callback for deriving a value from resolved input value */
export type ReadFnAsyncComplex<I,O> =
    ((values: I, set: ComplexSet<O>) => Unsubscriber | void);

/** Synchronous callback for deriving a value from resolved input value */
export type WriteFnSync<I,O> = (values: I) => O;

/** Asynchronous callback for deriving a value from resolved input value */
export type WriteFnAsync<I,O> =
    ((values: I, set: ComplexSet<O>) => void);

/**
 * A {@link Writable} store which contains the most recent of either:
 * * An input store transformed via a matching `read` transform
 * * A value set directly via `set` or `update`
 *
 * Additionally contains two other stores:
 * {@link derived$}
 * {@link smart$}
 */
export type TransformedStore<O> = Writable<O> & {
    /**
     * Contains the value of the input store transformed via a matching `read` transform
     */
    derived$: Readable<O | undefined>,

    /**
     * Contains the most recent value which was successfully transformed via either `read` or `write`
     */
    smart$: Readable<O | undefined>
};

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnAsyncComplex<I, O | undefined>,
    write: WriteFnAsync<O | undefined, I>
) : TransformedStore<O | undefined>;

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnAsyncComplex<I, O | undefined>,
    write: WriteFnSync<O | undefined, I>
) : TransformedStore<O | undefined>;

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 * @param initial_value Initial value of the resulting store
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnAsyncComplex<I, O>,
    write: WriteFnAsync<O, I>,
    initial_value: O
) : TransformedStore<O>;

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 * @param initial_value Initial value of the resulting store
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnAsyncComplex<I, O>,
    write: WriteFnSync<O, I>,
    initial_value: O
) : TransformedStore<O>;


/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnSync<I, O>,
    write: WriteFnAsync<O, I>
) : TransformedStore<O>;

/**
 * Creates a new {@link TransformedStore} store by applying transform functions on both read and write.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param store$ input store
 * @param read callback used to transform values from the input store into values for the output store
 * @param write callback used setting the value of the output store. result is applied to the input store.
 */
export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnSync<I, O>,
    write: WriteFnSync<O, I>
) : TransformedStore<O>;


export function transform<I, O>(
    store$: Writable<I>,
    read: ReadFnSync<I, O> | ReadFnAsyncComplex<I, O>,
    write: WriteFnSync<O, I> | WriteFnAsync<O, I>,
    initial_value?: O
) : TransformedStore<O>  {

    // Derive the formal outer_value
    // Note: This intermediary allows us to subscribe and unsubscribe without changing the evaluation order
    const derived$ = derive(
        store$,
        (inner_value, set) => {
            if (read.length <= 1) {
                const outer_value = (<ReadFnSync<I, O>>read)(inner_value);
                set(outer_value);
                return;
            }
            else {
                return (<ReadFnAsyncComplex<I, O>>read)(inner_value, set);
            }
        },
        <O>initial_value
    );

    let verbatim$_set: ComplexSet<O> | undefined;

    const verbatim$ = writable<O>(
        <O>initial_value,
        set => {
            verbatim$_set = set;

            bind(true);

            return unbind;
        }
    );

    let unsub: Action | undefined = undefined;
    let smart$_set: ComplexSet<O>;

    const outer_set = (value: O) => {
        smart$.set(value);
        verbatim$.set(value);
    }

    const bind = (initial: boolean) => {
        if (!unsub) {
            unsub = derived$.subscribe(
                initial ? outer_set : skip(outer_set),
                smart$_set?.invalidate,
                smart$_set?.revalidate
            );
        }
    };

    const unbind = () => {
        unsub?.();
        unsub = undefined;
    }

    const smart$ = writable<O>(
        <O>initial_value,
        (set) => {
            smart$_set = set;

            bind(true);

            return unbind;
        }
    );

    const write_is_sync = write.length <= 1;

    const set = write_is_sync
    ? (outer_value: O) => {
        verbatim$_set?.invalidate?.();

        const inner_value = (<WriteFnSync<O, I>>write)(outer_value);

        // keep derived active
        const unsub_fake_bind = derived$.subscribe(() => {});

        unbind();
        smart$_set?.invalidate();
        store$.set(inner_value);
        smart$.set(outer_value);
        bind(false);

        unsub_fake_bind();

        verbatim$.set(outer_value);
    }
    : (outer_value: O) => {
        verbatim$_set?.invalidate?.();

        const local_set = (inner_value: I) => {
            const undrafted_inner_value = isDraft(inner_value)
            ? <I>finishDraft(inner_value)
            : inner_value;

            // keep derived active
            const unsub_fake_bind = derived$.subscribe(() => {});

            unbind();
            smart$_set?.invalidate();
            store$.set(undrafted_inner_value);
            smart$.set(outer_value);
            bind(false);

            unsub_fake_bind();
        };

        const local_update = (updater: UpdaterAsync<I> | UpdaterSync<I>) => {
            store$.update(
                (current_inner_value, _set) => {
                    if (updater.length <= 1) {
                        const inner_value = (<UpdaterSync<I>>updater)(current_inner_value);
                        local_set(inner_value);
                    }
                    else {
                        (<UpdaterAsync<I>>updater)(current_inner_value, local_set)
                    }
                }
            );
        }

        write(outer_value, Object.assign(
            (value: I) => local_set(value),
            {
                set: local_set,
                update: local_update,
                invalidate: smart$_set?.invalidate ?? noop,
                revalidate: smart$_set?.revalidate ?? noop
            }
        ));

        verbatim$.set(outer_value);
    }

    const update = (updater: UpdaterSync<O> | UpdaterAsync<O>) => {
        smart$.update((value, _set) => {
            if (updater.length <= 1)
                set((<UpdaterSync<O>>updater)(value))
            else
                updater(value, set);
        });
    }

    return {
        ...read_only(verbatim$),
        derived$: derived$,
        smart$: read_only(smart$),
        set,
        update
    }
}
