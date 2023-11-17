import {Readable, Writable} from "@crikey/stores-base";
import {Deletable, DeleteSelector, ReadSelector, WriteSelector} from "./types";
import {select1} from "./select1";
import {by_chain} from "./by_chain";

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
 * @param a
 * @param b
 */
export function select<A,B,C>(
    store: Writable<A>,
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    b: ReadSelector<B, C> & WriteSelector<B, C> & DeleteSelector<B>
) : Writable<C> & Deletable;

/**
 * Create a derived writable store
 *
 * @param store
 * @param a
 * @param b
 */
export function select<A,B,C>(
    store: Writable<A>,
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    b: ReadSelector<B, C> & WriteSelector<B, C>
) : Writable<C>;

/**
 * Create a derived readable store
 *
 * @param store
 * @param a
 * @param b
 */
export function select<A,B,C>(
    store: Readable<A>,
    a: ReadSelector<A, B>,
    b: ReadSelector<B, C>
) : Readable<C>;

// 3 selectors

/**
 * Create a derived writable/deletable store
 *
 * @param store
 * @param a
 * @param b
 * @param c
 */
export function select<A,B,C,D>(
    store: Writable<A>,
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    b: ReadSelector<B, C> & WriteSelector<B, C>,
    c: ReadSelector<C, D> & WriteSelector<C, D> & DeleteSelector<C>
) : Writable<D> & Deletable;

/**
 * Create a derived writable store
 *
 * @param store
 * @param a
 * @param b
 * @param c
 */
export function select<A,B,C,D>(
    store: Writable<A>,
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    b: ReadSelector<B, C> & WriteSelector<B, C>,
    c: ReadSelector<C, D> & WriteSelector<C, D>
) : Writable<D>;

/**
 * Create a derived readable store
 *
 * @param store
 * @param a
 * @param b
 * @param c
 */
export function select<A,B,C,D>(
    store: Readable<A>,
    a: ReadSelector<A, B>,
    b: ReadSelector<B, C>,
    c: ReadSelector<C, D>,
) : Readable<D>;

// ---

/**
 * Create an arbitrarily deep derived child store
 *
 * Note: loses type saftey
 * @param store
 * @param initial
 * @param next
 */
/*
export function select<I,O>(
    store: Readable<I> | Writable<I>,
    initial: ReadSelector<I, unknown> & Partial<WriteSelector<I, unknown>> & Partial<DeleteSelector<unknown>>,
    ...next: [
        ...Array<ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>>>,
        ReadSelector<unknown, O> & Partial<WriteSelector<unknown, O>> & Partial<DeleteSelector<unknown>>
    ]
) : Partial<Readable<O>> & Partial<Writable<O>> & Partial<Deletable>;
*/
export function select(
    store: Readable<unknown> | Writable<unknown>,
    initial: ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>>,
    ...next: (ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>>)[]
) : Partial<Readable<unknown>> & Partial<Writable<unknown>> & Partial<Deletable> {
    return select1(store, by_chain(initial, ...<any>next));
}
