import {expect, it, vi} from "vitest";
import {transform, writable} from "../src";

it('should trigger on safe not equal', () => {
    const result = [0];
    const store = writable(2);
    const transformed = transform(
        store,
        value => {
            result[0] = Math.floor(value / 2);
            return result;
        },
        (value: number[]) => value[0]
    );
    const watch = vi.fn();

    transformed.subscribe(watch);

    store.set(3);
    store.set(4);

    //console.log('watch', watch.mock.calls);

    expect(watch.mock.calls).to.have.lengthOf(3);
});
