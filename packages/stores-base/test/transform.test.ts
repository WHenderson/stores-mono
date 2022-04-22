import {expect, vi, it} from "vitest";
import {ComplexSet, transform, trigger_always, trigger_strict_not_equal, writable} from "../src";

it('should transform values', () => {
    const input = writable(trigger_strict_not_equal, 1);
    const derived = transform(
        trigger_always,
        input,
        (value) => `#${value}`
    );

    const watch = vi.fn();
    derived.subscribe(watch);

    input.set(2);
    input.set(3);

    expect(watch.mock.calls).to.deep.equal([
        ['#1'],
        ['#2'],
        ['#3']
    ]);
});

it('should transform values async', () => {
    const input = writable(trigger_strict_not_equal, 1);
    const derived = transform(
        trigger_always,
        input,
        (value, set: ComplexSet<string | undefined>) => {
            set(`#${value}`)
        }
    );

    const watch = vi.fn();
    derived.subscribe(watch);

    input.set(2);
    input.set(3);

    expect(watch.mock.calls).to.deep.equal([
        ['#1'],
        ['#2'],
        ['#3']
    ]);
});

it('should transform values via chain', () => {
    const input = writable(trigger_strict_not_equal, 1);
    const a = writable(trigger_strict_not_equal, 'a');
    const b = writable(trigger_strict_not_equal, 'b');

    const derived = transform(
        trigger_always,
        input,
        (value, set: ComplexSet<string | undefined>) => {
            if (value % 2 === 0)
                return a.subscribe(set);
            else
                return b.subscribe(set);
        }
    );

    const watch = vi.fn();
    const unsub = derived.subscribe(watch);

    input.set(2);
    input.set(3);
    b.set('bb');

    expect(watch.mock.calls).to.deep.equal([
        ['b'],
        ['a'],
        ['b'],
        ['bb']
    ]);

    unsub();
});
