import {Readable, Writable} from "@crikey/stores-base";
import {Deletable, DeleteSelector, ReadSelector, WriteSelector} from "./types";
import {by_combined} from "./by_combined";

// 1 selector

/**
 * Create a derived writable/deletable store
 *
 * @param store
 * @param initial
 */
export function select<I,O>(
    store: Writable<I>,
    initial: ReadSelector<I, O> & WriteSelector<I, O> & DeleteSelector<I>
) : Writable<O> & Deletable;

/**
 * Create a derived writable store
 *
 * @param store
 * @param initial
 */
export function select<I,O>(
    store: Writable<I>,
    initial: ReadSelector<I, O> & WriteSelector<I, O>
) : Writable<O>;

/**
 * Create a derived readable/deletable store
 *
 * @param store
 * @param initial
 */
export function select<I,O>(
    store: Writable<I>,
    initial: ReadSelector<I, O> & DeleteSelector<I>
) : Readable<O> & Deletable;

/**
 * Create a derived readable store
 *
 * @param store
 * @param initial
 */
export function select<I,O>(
    store: Readable<I>,
    initial: ReadSelector<I, O>
) : Readable<O>;

// 2 selectors

/**
 * Create a derived writable/deletable store
 *
 * @param store
 * @param initial
 * @param next
 */
export function select<I,O>(
    store: Writable<I>,
    initial: ReadSelector<I, O> & WriteSelector<I, O>,
    ...next: [
        ReadSelector<I, O> & WriteSelector<I, O> & DeleteSelector<I>,
    ]
) : Writable<O> & Deletable;

/**
 * Create a derived writable store
 *
 * @param store
 * @param initial
 * @param next
 */
export function select<I,O>(
    store: Writable<I>,
    initial: ReadSelector<I, O> & WriteSelector<I, O>,
    ...next: [
        ReadSelector<I, O> & WriteSelector<I, O>,
    ]
) : Writable<O>;

/**
 * Create a derived readable store
 *
 * @param store
 * @param initial
 * @param next
 */
export function select<I,O>(
    store: Readable<I>,
    initial: ReadSelector<I, O>,
    ...next: [
        ReadSelector<I, O>,
    ]
) : Readable<O>;

/**
 * Create an arbitrarily deep derived child store
 *
 * Note: loses type saftey
 * @param store
 * @param initial
 * @param next
 */
export function select<I,O>(
    store: Readable<I> | Writable<I>,
    initial: ReadSelector<I, unknown> & Partial<WriteSelector<I, unknown>> & Partial<DeleteSelector<unknown>>,
    ...next: [
        ...Array<ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>>>,
        ReadSelector<unknown, O> & Partial<WriteSelector<unknown, O>> & Partial<DeleteSelector<unknown>>
    ]
) : Partial<Readable<O>> & Partial<Writable<O>> & Partial<Deletable>;

export function select(
    store: Readable<unknown> | Writable<unknown>,
    initial: ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>>,
    ...next: (ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>>)[]
) : Partial<Readable<unknown>> & Partial<Writable<unknown>> & Partial<Deletable> {
    return select(store, by_combined(initial, ...<any>next));
}
