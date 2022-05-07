import {expect, vi, it} from "vitest";
import {ComplexSet, transform, trigger_always, trigger_strict_not_equal, writable, Set} from "../src";

it('should transform values', () => {
    const input = writable(trigger_strict_not_equal, 1);
    const transformed = transform(
        trigger_always,
        input,
        (value) => `#${value}`,
        (value : string) => parseInt(value.slice(1), 10)
    );

    const watch_i = vi.fn();
    input.subscribe(watch_i);

    const watch_t = vi.fn();
    transformed.subscribe(watch_t);

    input.set(2);
    input.set(3);

    transformed.set('#139');

    // TODO: Create example of this inference issue and ask about it on typescript forum/discord

    transformed.update((value : string) => value + '0');

    expect(watch_i.mock.calls).to.deep.equal([
        [1],
        [2],
        [3],
        [139],
        [1390]
    ]);

    expect(watch_t.mock.calls).to.deep.equal([
        ['#1'],
        ['#2'],
        ['#3'],
        ['#139'],
        ['#1390']
    ]);
});

it('should transform values async', () => {
    const input = writable(trigger_strict_not_equal, 1);
    const transformed = transform(
        trigger_always,
        input,
        (value, set: ComplexSet<string | undefined>) => {
            set(`#${value}`)
        },
        (value : string | undefined, set: Set<number>) => {
            set(parseInt((value ?? '').slice(1), 10))
        }
    );

    const watch_i = vi.fn();
    input.subscribe(watch_i);

    const watch_t = vi.fn();
    transformed.subscribe(watch_t);

    input.set(2);
    input.set(3);

    transformed.set('#139');

    transformed.update((value : string | undefined) => (value ?? '') + '0');

    expect(watch_i.mock.calls).to.deep.equal([
        [1],
        [2],
        [3],
        [139],
        [1390]
    ]);

    expect(watch_t.mock.calls).to.deep.equal([
        ['#1'],
        ['#2'],
        ['#3'],
        ['#139'],
        ['#1390']
    ]);
});

it('should transform values via chain', () => {
    const input = writable(trigger_strict_not_equal, 1);
    const a = writable(trigger_strict_not_equal, 'a');
    const b = writable(trigger_strict_not_equal, 'b');

    const transformed = transform(
        trigger_always,
        input,
        (value, set: ComplexSet<string | undefined>) => {
            if (value % 2 === 0)
                return a.subscribe(set);
            else
                return b.subscribe(set);
        },
        (value: string | undefined) => {
            return (value ?? '').length;
        }
    );

    const watch_i = vi.fn();
    input.subscribe(watch_i);

    const watch_t = vi.fn();
    transformed.subscribe(watch_t);

    input.set(2);
    a.set('even');

    input.set(3);
    b.set('odd');

    transformed.set('even');
    transformed.set('odd');

    transformed.update((value : string | undefined) => (value ?? '') + '_');

    expect(watch_i.mock.calls).to.deep.equal([
        [1],
        [2],
        [3],
        [4],
        [3],
        [4]
    ]);

    expect(watch_t.mock.calls).to.deep.equal([
        ['b'],
        ['a'],
        ['even'],
        ['b'],
        ['odd'],
        ['even'],
        ['odd'],
        ['even'],
    ]);
});
