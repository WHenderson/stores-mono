import {expect, vi, it} from "vitest";
import {selectable} from "../../src";
import {writable} from "@crikey/stores-strict";

it('strict derive should only trigger on change', () => {
    type Root = Record<string, Record<string, number>>;

    const store = selectable(writable<Root>({ a: { b: 1 } }));

    const watchRoot = vi.fn();
    store.subscribe(watchRoot);
    expect(watchRoot.mock.calls[0][0]).to.deep.equal({ a: { b: 1 } });

    const watchA = vi.fn();
    store.select(root => root.a).subscribe(watchA);
    expect(watchA.mock.calls[0][0]).to.deep.equal({ b: 1 });

    const watchB = vi.fn();
    store.select(root => root.a.b).subscribe(watchB);
    expect(watchB.mock.calls[0][0]).to.deep.equal(1);

    store.select(root => root.a.b).set(2);
    // root is not changed, no signals
    expect(watchRoot).toHaveBeenCalledTimes(1);
    expect(watchA).toHaveBeenCalledTimes(1);
    expect(watchB).toHaveBeenCalledTimes(1);

    store.select(root => root.a.b).set(2);
    // root is not changed, no signals
    expect(watchRoot).toHaveBeenCalledTimes(1);
    expect(watchA).toHaveBeenCalledTimes(1);
    expect(watchB).toHaveBeenCalledTimes(1);

    store.set({ a: { b: 2 }, c: {}});
    // all values changed, each subscriber signaled
    expect(watchRoot).toHaveBeenCalledTimes(2);
    expect(watchA).toHaveBeenCalledTimes(2);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.select(root => root.c.d).set(3);
    // root is not changed, no signals
    expect(watchRoot).toHaveBeenCalledTimes(2);
    expect(watchA).toHaveBeenCalledTimes(2);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.set({ a: { b: 2 }});
    // root and a values changed, b is not changed
    expect(watchRoot).toHaveBeenCalledTimes(3);
    expect(watchA).toHaveBeenCalledTimes(3);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.select(root => root.a.b).update(b => b + 1);
    // root is not changed, no signals
    expect(watchRoot).toHaveBeenCalledTimes(3);
    expect(watchA).toHaveBeenCalledTimes(3);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.select(root => root.a.b).update(b => b);
    // nothing changed, no signals
    expect(watchRoot).toHaveBeenCalledTimes(3);
    expect(watchA).toHaveBeenCalledTimes(3);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.update(root => {
        root.a.b += 1;
        return root;
    });
    // root is not changed, no signals
    expect(watchRoot).toHaveBeenCalledTimes(3);
    expect(watchA).toHaveBeenCalledTimes(3);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.update(root => {
        return root;
    });
    // root is not changed, no signals
    expect(watchRoot).toHaveBeenCalledTimes(3);
    expect(watchA).toHaveBeenCalledTimes(3);
    expect(watchB).toHaveBeenCalledTimes(2);
});
