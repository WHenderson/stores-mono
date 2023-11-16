import {DeleteSelector, ReadSelector, WriteSelector} from "./types";
import {by_chain2} from "./by_chain2";

// A -> B
export function by_chain<A,B>(
    a: ReadSelector<A, B> & WriteSelector<A, B> & DeleteSelector<B>
): ReadSelector<A, B> & WriteSelector<A, B> & DeleteSelector<A>;

export function by_chain<A,B>(
    a: ReadSelector<A, B> & WriteSelector<A, B>
): ReadSelector<A, B> & WriteSelector<A, B>;

export function by_chain<A,B>(
    a: ReadSelector<A, B>
): ReadSelector<A, B>;

// A -> B -> C

export function by_chain<A,B,C>(
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    ...b: [
        ReadSelector<B, C> & WriteSelector<B, C> & DeleteSelector<B>
    ]
): ReadSelector<A, C> & WriteSelector<A, C> & DeleteSelector<A>;

export function by_chain<A,B,C>(
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    ...b: [
        ReadSelector<B, C> & WriteSelector<B, C>
    ]
): ReadSelector<A, C> & WriteSelector<A, C>;

export function by_chain<A,B,C>(
    a: ReadSelector<A, B>,
    ...b: [
        ReadSelector<B, C>
    ]
): ReadSelector<A, C>;

// A -> B -> C -> D

export function by_chain<A,B,C,D>(
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    ...b: [
        ReadSelector<B, C> & WriteSelector<B, C>,
        ReadSelector<C, D> & WriteSelector<C, D> & DeleteSelector<C>
    ]
): ReadSelector<A, D> & WriteSelector<A, D> & DeleteSelector<A>;

export function by_chain<A,B,C,D>(
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    ...b: [
        ReadSelector<B, C> & WriteSelector<B, C>,
        ReadSelector<C, D> & WriteSelector<C, D>
    ]
): ReadSelector<A, D> & WriteSelector<A, D>;

export function by_chain<A,B,C,D>(
    a: ReadSelector<A, B>,
    ...b: [
        ReadSelector<B, C>,
        ReadSelector<C, D>
    ]
): ReadSelector<A, D>;

// A -> B -> C -> D -> E

export function by_chain<A,B,C,D,E>(
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    ...b: [
            ReadSelector<B, C> & WriteSelector<B, C>,
            ReadSelector<C, D> & WriteSelector<C, D>,
            ReadSelector<D, E> & WriteSelector<D, E> & DeleteSelector<D>
    ]
): ReadSelector<A, E> & WriteSelector<A, E> & DeleteSelector<A>;

export function by_chain<A,B,C,D,E>(
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    ...b: [
            ReadSelector<B, C> & WriteSelector<B, C>,
            ReadSelector<C, D> & WriteSelector<C, D>,
            ReadSelector<D, E> & WriteSelector<D, E>
    ]
): ReadSelector<A, E> & WriteSelector<A, E>;

export function by_chain<A,B,C,D,E>(
    a: ReadSelector<A, B>,
    ...b: [
        ReadSelector<B, C>,
        ReadSelector<C, D>,
        ReadSelector<D, E>
    ]
): ReadSelector<A, E>;


// A ... Z
// Note: loses type safety

export function by_chain<A,Z>(
    initial: ReadSelector<A, unknown> & Partial<WriteSelector<A, unknown>> & Partial<DeleteSelector<A>>,
    ...selectors: [
        ...(ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>>)[],
        ReadSelector<unknown, Z> & Partial<WriteSelector<unknown, Z>> & Partial<DeleteSelector<Z>>
    ]
): ReadSelector<A, Z> & Partial<WriteSelector<A, Z>> & Partial<DeleteSelector<A>>;

export function by_chain(
    initial: ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>>,
    ...selectors: (ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>>)[]
): ReadSelector<unknown, unknown> & Partial<WriteSelector<unknown, unknown>> & Partial<DeleteSelector<unknown>> {
    return selectors.reduce(
        (a, b) => by_chain2(a, b),
        initial
    );
}
