import {expect, it, vi} from 'vitest'
import {derive, readable, writable} from "../src";
import {get, Subscriber} from "@crikey/stores-base";

it('should only trigger once all dependencies are ready', () => {
    // diamond dependency problem

    const root = writable(1);
    const lhs = derive(root, root => root * 10);
    const rhs = derive(root, root => root * 100);
    const combined = derive([lhs, rhs], ([lhs, rhs]) => lhs + rhs);

    const watch = vi.fn();
    combined.subscribe(watch);

    root.set(2);
    root.set(3);
    expect(watch.mock.calls).to.deep.equal([
        [110],
        [220],
        [330]
    ]);
});

it('should support async resolution', () => {
    const root = readable(1);
    let set: Subscriber<number>;
    const derived = derive(root, (_root, set_: Subscriber<number>) => {
        set = set_;
    }, -1);

    const watch = vi.fn();
    derived.subscribe(watch);
    expect(watch.mock.calls).to.deep.equal([[-1]])

    set!(2);
    set!(3);
    expect(watch.mock.calls).to.deep.equal([[-1], [2], [3]]);
});

it('should run cleanup code', () => {
    const watch = vi.fn();
    const store = derive(readable(1), (value, set: Subscriber<number>) => {
        set(value);
        return watch;
    });

    expect(get(store)).toBe(1);
    expect(watch).toHaveBeenCalledOnce();
});
