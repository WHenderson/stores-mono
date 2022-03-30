import {expect, fn, it} from "vitest";
import {selectify} from "../../src";
import {derive, writable} from "@crikey/stores-immer";

it('strict derive should only trigger on change', () => {
    type Root = Record<string, Record<string, number>>;

    const store = selectify(writable<Root>({ a: { b: 1 } }), derive);

    const watchRoot = fn();
    store.subscribe(watchRoot);
    expect(watchRoot.mock.calls[0][0]).to.deep.equal({ a: { b: 1 } });

    const watchA = fn();
    store.select(root => root.a).subscribe(watchA);
    expect(watchA.mock.calls[0][0]).to.deep.equal({ b: 1 });

    const watchB = fn();
    store.select(root => root.a.b).subscribe(watchB);
    expect(watchB.mock.calls[0][0]).to.deep.equal(1);

    store.select(root => root.a.b).set(2);
    // child changed, signal parents
    expect(watchRoot).toHaveBeenCalledTimes(2);
    expect(watchA).toHaveBeenCalledTimes(2);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.select(root => root.a.b).set(2);
    // child set to same value, no change
    expect(watchRoot).toHaveBeenCalledTimes(2);
    expect(watchA).toHaveBeenCalledTimes(2);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.set({ a: { b: 2 }, c: {}});
    // complex types all changed, primitive types not changed
    expect(watchRoot).toHaveBeenCalledTimes(3);
    expect(watchA).toHaveBeenCalledTimes(3);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.select(root => root.c.d).set(3);
    // child changed, signal all parents
    expect(watchRoot).toHaveBeenCalledTimes(4);
    expect(watchA).toHaveBeenCalledTimes(3); // not part of the branch that changed
    expect(watchB).toHaveBeenCalledTimes(2); // not part of the branch that changed

    store.set({ a: { b: 2 }});
    // complex types all changed, primitive types not changed
    expect(watchRoot).toHaveBeenCalledTimes(5);
    expect(watchA).toHaveBeenCalledTimes(4);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.select(root => root.a.b).update(b => b + 1);
    // child changed, signal all parents
    expect(watchRoot).toHaveBeenCalledTimes(6);
    expect(watchA).toHaveBeenCalledTimes(5);
    expect(watchB).toHaveBeenCalledTimes(3);

    store.select(root => root.a.b).update(b => b);
    // child set to same value, no change
    expect(watchRoot).toHaveBeenCalledTimes(6);
    expect(watchA).toHaveBeenCalledTimes(5);
    expect(watchB).toHaveBeenCalledTimes(3);

    store.update(root => {
        root.a.b += 1;
        return root;
    });
    // child changed, signal all parents
    expect(watchRoot).toHaveBeenCalledTimes(7);
    expect(watchA).toHaveBeenCalledTimes(6);
    expect(watchB).toHaveBeenCalledTimes(4);

    store.update(root => {
        return root;
    });
    // child set to same value, no change
    expect(watchRoot).toHaveBeenCalledTimes(7);
    expect(watchA).toHaveBeenCalledTimes(6);
    expect(watchB).toHaveBeenCalledTimes(4);
});
