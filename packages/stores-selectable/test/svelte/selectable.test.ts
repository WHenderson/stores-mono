import {expect, fn, it} from "vitest";
import {selectable} from "../../src";
import {writable} from "@crikey/stores-svelte";
import {trigger_safe_not_equal} from "@crikey/stores-base/src";

it('strict derive should only trigger on change', () => {
    type Root = Record<string, Record<string, number>>;

    // Change trigger semantics on selectable
    const store = selectable(
        writable<Root>({ a: { b: 1 } }),
        Object.assign(
            {},
            selectable.default_options,
            { trigger: trigger_safe_not_equal }
        )
    );

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
    // root is not changed, but svelte is greedy for arrays/objects
    expect(watchRoot).toHaveBeenCalledTimes(2);
    expect(watchA).toHaveBeenCalledTimes(2);
    expect(watchB).toHaveBeenCalledTimes(2);

    store.select(root => root.a.b).set(2);
    // root is not changed, but svelte is greedy for arrays/objects
    expect(watchRoot).toHaveBeenCalledTimes(3);
    expect(watchA).toHaveBeenCalledTimes(3);
    expect(watchB).toHaveBeenCalledTimes(2); // svelte is not greedy for primitive types

    store.set({ a: { b: 2 }, c: {}});
    // all values changed, each subscriber signaled
    expect(watchRoot).toHaveBeenCalledTimes(4);
    expect(watchA).toHaveBeenCalledTimes(4);
    expect(watchB).toHaveBeenCalledTimes(2); // svelte is not greedy for primitive types

    store.select(root => root.c.d).set(3);
    // root is not changed, but svelte is greedy for arrays/objects
    expect(watchRoot).toHaveBeenCalledTimes(5);
    expect(watchA).toHaveBeenCalledTimes(5); // svelte is greedy for arrays/objects
    expect(watchB).toHaveBeenCalledTimes(2); // svelte is not greedy for primitive types

    store.set({ a: { b: 2 }});
    // root is not changed, but svelte is greedy for arrays/objects
    expect(watchRoot).toHaveBeenCalledTimes(6);
    expect(watchA).toHaveBeenCalledTimes(6); // svelte is greedy for arrays/objects
    expect(watchB).toHaveBeenCalledTimes(2); // svelte is not greedy for primitive types

    store.select(root => root.a.b).update(b => b + 1);
    // child changed, signal all parents
    expect(watchRoot).toHaveBeenCalledTimes(7);
    expect(watchA).toHaveBeenCalledTimes(7);
    expect(watchB).toHaveBeenCalledTimes(3);

    store.select(root => root.a.b).update(b => b);
    // child set to same value, no change
    expect(watchRoot).toHaveBeenCalledTimes(8); // svelte is greedy for arrays/objects
    expect(watchA).toHaveBeenCalledTimes(8); // svelte is greedy for arrays/objects
    expect(watchB).toHaveBeenCalledTimes(3);

    store.update(root => {
        root.a.b += 1;
        return root;
    });
    // child changed, signal all parents
    expect(watchRoot).toHaveBeenCalledTimes(9);
    expect(watchA).toHaveBeenCalledTimes(9);
    expect(watchB).toHaveBeenCalledTimes(4);

    store.update(root => {
        return root;
    });
    // child set to same value, no change
    expect(watchRoot).toHaveBeenCalledTimes(10); // svelte is greedy for arrays/objects
    expect(watchA).toHaveBeenCalledTimes(10); // svelte is greedy for arrays/objects
    expect(watchB).toHaveBeenCalledTimes(4);

});
