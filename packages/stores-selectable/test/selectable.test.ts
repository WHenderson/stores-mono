import {expect, it} from 'vitest'
import {derive, readable, writable} from "@crikey/stores-strict";
import {selectable, SelectableDelete} from "../src";
import {get, Readable, Writable} from "@crikey/stores-base";

function isWritable<T>(store: Readable<T> | Writable<T>): store is Writable<T> {
    return ('set' in store && 'update' in store);
}

it('should maintain store type', () => {
    const ro = selectable(readable({ a: 1 }), derive);
    const rw = selectable(writable({ a: 1 }), derive);

    expect(isWritable(ro)).toBeFalsy();
    expect(isWritable(rw)).toBeTruthy();

    expect(isWritable(ro.select(root => root.a))).toBeFalsy();
    expect(isWritable(rw.select(root => root.a))).toBeTruthy();
});

it('should select child', () => {
    const ro = selectable(readable([{a:1,b:2},{a:3, b:4}]), derive);
    expect(get(ro.select(root => root[1].b))).toBe(get(ro)[1].b);
    expect(get(ro.select(0))).toBe(get(ro)[0]);
    expect(get(ro.select([1, 'b']))).toBe(get(ro)[1].b);
    expect(get(ro.select([1, 'b'], 0))).toBe(get(ro)[1].b);
    expect(get(ro.select([1, 'b'], 0).select([]))).toBe(get(ro));

    expect(get(ro.select(root => root[1].b).select(['a'], 1))).toBe(get(ro)[1].a);
    expect(get(ro.select(root => root[1].b).select([], 2))).toBe(get(ro));
});

it('should maintain path during selection', () => {
    const ro = selectable(readable([{a:1,b:2},{a:3, b:4}]), derive);

    expect(ro.path).to.deep.equal([]);
    expect(ro.select(root => root[0].a).path).to.deep.equal([0, 'a']);
    expect(ro.select(root => root[0].a).select(['b'], 1).path).to.deep.equal([0, 'b']);
    expect(ro.select(root => root[0].a).select([]).path).to.deep.equal([]);
    expect(ro.select(root => root[0].a).select([1, 'b']).path).to.deep.equal([1, 'b']);
});

it('should allow deletion for writable types which support undefined', () => {
    interface Root {
        a: number | undefined;
        b: number;
    }

    const ro = selectable(readable<Root | undefined>({ a: <undefined | number> 1, b: 1}), derive);
    expect(ro).not.has.property('delete');

    const rw = selectable(writable<Root | undefined>({ a: <undefined | number> 1, b: 1}), derive);
    expect(get(rw)).to.deep.equal({ a: 1, b: 1});

    rw.select(root => root!.a).delete();
    expect(get(rw)).to.deep.equal({ b: 1});

    // this is designed as a compile time check to see that only undefined-able types can be deleted
    const b = rw.select(root => root!.b);
    type HasDelete<X> = X extends SelectableDelete ? true : false;
    const bHasDelete: HasDelete<typeof b> = false;
    expect(bHasDelete).toBeFalsy();

    rw.delete();
    expect(get(rw)).toBeUndefined();
});

type JsonValue = null | boolean | number | string | JsonObject | JsonArray;
type JsonObject = { [x: string]: JsonValue };
type JsonArray = Array<JsonValue>;

const selector = (root: JsonValue): number | undefined => {
    const r = (<JsonObject>root)
    const a = (<JsonArray>r.a);
    const v = (<number>a[3]);
    return v;
}

it('should return undefined for undefined paths', () => {
    const store = selectable(readable<JsonValue>({}), derive);

    expect(get(store.select(selector))).toBeUndefined();
});

it('should generate the necessary json primitives when setting an undefined path', () => {
    const store = selectable(writable<JsonValue>(undefined), derive);

    expect(get(store.select(['a','b','c', 2, 0]))).toBeUndefined();

    // create path as necessary
    store.select(['a','b','c', 2, 0]).set(1);
    expect(get(store)).to.deep.equal({ a: { b: { c: [undefined, undefined, [1]] } } });
});

it('should fail to set members of a primitive', () => {
    const store = selectable(writable<JsonValue>(1), derive);

    expect(() => store.select(selector).set(1)).to.throw(TypeError);
});

it('should fail to set string members of array', () => {
    const store = selectable(writable<JsonValue>([]), derive);

    expect(() => store.select(selector).set(1)).to.throw(TypeError);
});

it('should fail to select relative paths below root', () => {
    expect(() => selectable(readable(), derive).select([], 0)).not.to.throw();
    expect(() => selectable(readable(), derive).select([], 1)).to.throw(RangeError);
    expect(() => selectable(readable(), derive).select(['a']).select([], 1)).not.to.throw();
    expect(() => selectable(readable(), derive).select(['a']).select([], 2)).to.throw(RangeError);
})

it('should update root store value', () => {
    const store = selectable(writable<number>(), derive);
    expect(get(store)).toBeUndefined();

    store.select(root => root).set(1);
    expect(get(store)).toBe(1);

    store.select(root => root).delete();
    expect(get(store)).toBeUndefined();

    store.select(root => root).update(root => root ?? 1);
    expect(get(store)).toBe(1);
});

it('deleting element from array should set element to undefined', () => {
    const store = selectable(writable([undefined, 1]), derive);
    store.select(root => root[1]).delete();
    expect(get(store)).to.deep.equal([undefined, undefined]);
});

it('path selection methods should be equivalent', () => {
    const store = selectable(readable<any>(undefined), derive);
    expect(store.select(root => root.a.b[1]).path).to.deep.equal(['a','b', 1]);
    expect(store.select(root => root.a).select(root => root.b[1]).path).to.deep.equal(['a','b', 1]);
    expect(store.select('a').select('b').select(1).path).to.deep.equal(['a','b', 1]);
})
