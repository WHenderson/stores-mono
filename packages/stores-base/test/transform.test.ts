import {expect, fn, it} from "vitest";
import {transform, trigger_always, trigger_strict_not_equal, writable} from "../src";

it('should transform values', () => {
    const input = writable(trigger_strict_not_equal, 1);
    const derived = transform(
        trigger_always,
        input,
        (value) => `#${value}`
    );

    const watch = fn();
    derived.subscribe(watch);

    input.set(2);
    input.set(3);

    expect(watch.mock.calls).to.deep.equal([
        ['#1'],
        ['#2'],
        ['#3']
    ]);
})
