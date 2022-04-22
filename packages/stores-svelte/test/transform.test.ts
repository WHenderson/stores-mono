import {expect, it, vi} from "vitest";
import {transform, writable} from "../src";

it('should trigger on safe not equal', () => {
    const result = [0];
    const store = writable(2);
    const derived = transform(store, value => {
        result[0] = Math.floor(value / 2);
        return result;
    });
    const watch = vi.fn();

    derived.subscribe(watch);

    store.set(3);
    store.set(4);
    store.set(5);
    store.set(6);

    expect(watch.mock.calls).to.deep.equal([
        [result],
        [result],
        [result],
        [result],
        [result],
    ]);
});
