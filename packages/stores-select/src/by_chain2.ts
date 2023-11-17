import {DeleteSelector, ReadSelector, WriteSelector} from "./types";


export function by_chain2<A,B,C>(
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    b: ReadSelector<B, C> & WriteSelector<B, C> & DeleteSelector<B>
): ReadSelector<A, C> & WriteSelector<A, C> & DeleteSelector<A>;

export function by_chain2<A,B,C>(
    a: ReadSelector<A, B> & WriteSelector<A, B>,
    b: ReadSelector<B, C> & WriteSelector<B, C>
): ReadSelector<A, C> & WriteSelector<A, C>;

export function by_chain2<A,B,C>(
    a: ReadSelector<A, B>,
    b: ReadSelector<B, C>
): ReadSelector<A, C>;

export function by_chain2<A,B,C>(
    a: ReadSelector<A, B> & Partial<WriteSelector<A, B>>,
    b: ReadSelector<B, C> & Partial<WriteSelector<B, C>> & Partial<DeleteSelector<B>>
): ReadSelector<A, C> & Partial<WriteSelector<A, C>> & Partial<DeleteSelector<A>> {
    const { get: a_get, update: a_update} = a;
    const { get: b_get, update: b_update, delete: b_delete } = b;

    const method_get: ReadSelector<A, C>["get"] = (parent) => b_get(a_get(parent));

    const method_update: WriteSelector<A, C>["update"] | undefined = a_update && b_update
        ? (parent, value) => a_update(parent, b_update(a_get(parent), value))
        : undefined

    const method_delete: DeleteSelector<A>["delete"] | undefined = a_update && b_delete
        ? (parent) => a_update(parent, b_delete(a_get(parent)))
        : undefined;

    return {
        get: method_get,
        ...(method_update ? { update: method_update } : {}),
        ...(method_delete ? { delete: method_delete } : {})
    }
}
