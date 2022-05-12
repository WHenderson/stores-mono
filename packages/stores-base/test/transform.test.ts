import {expect, vi, it} from "vitest";
import {ComplexSet, transform, trigger_always, trigger_strict_not_equal, writable, Set, derive} from "../src";

it('should transform values (sync read, sync write)', () => {
    const input = writable(trigger_strict_not_equal, 1);
    const transformed = transform(
        trigger_always,
        input,
        (value) => `#${value}`,
        (value : string) => parseInt(value.slice(1), 10)
    );

    const combined = derive(
        trigger_always,
        [input, transformed, transformed.derived$, transformed.smart$],
        ([input, transformed, derived, smart]) =>
            [input, transformed, derived, smart] as const
    );

    const watch = vi.fn();
    combined.subscribe(watch);

    input.set(2);
    input.set(3);

    transformed.set('#139');

    transformed.update((value : string) => value + '0');

    //console.log('watch', watch.mock.calls);

    expect(watch.mock.calls).to.deep.equal([
        [ [ 1, '#1', '#1', '#1' ] ],
        [ [ 2, '#2', '#2', '#2' ] ],
        [ [ 3, '#3', '#3', '#3' ] ],
        [ [ 139, '#139', '#139', '#139' ] ],
        [ [ 1390, '#1390', '#1390', '#1390' ] ]
    ]);
});

it('should transform values (async read, async write)', () => {
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

    const combined = derive(
        trigger_always,
        [input, transformed, transformed.derived$, transformed.smart$],
        ([input, transformed, derived, smart]) =>
            [input, transformed, derived, smart] as const
    );

    const watch = vi.fn();
    combined.subscribe(watch);

    input.set(2);
    input.set(3);

    transformed.set('#139');

    transformed.update((value : string | undefined) => (value ?? '') + '0');

    // console.log('watch', watch.mock.calls);

    expect(watch.mock.calls).to.deep.equal([
        [ [ 1, '#1', '#1', '#1' ] ],
        [ [ 2, '#2', '#2', '#2' ] ],
        [ [ 3, '#3', '#3', '#3' ] ],
        [ [ 139, '#139', '#139', '#139' ] ],
        [ [ 1390, '#1390', '#1390', '#1390' ] ]
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
                return a.subscribe(set, set.invalidate, set.revalidate);
            else
                return b.subscribe(set, set.invalidate, set.revalidate);
        },
        (value: string | undefined) => {
            return (value ?? '').length;
        }
    );

    const combined = derive(
        trigger_always,
        [input, a, b, transformed, transformed.derived$, transformed.smart$],
        ([input, a, b, transformed, derived, smart]) =>
            [input, a, b, transformed, derived, smart] as const
    );

    const watch = vi.fn();
    combined.subscribe(watch);

    input.set(2);
    a.set('even');

    input.set(3);
    b.set('odd');

    transformed.set('even');
    transformed.set('odd');

    transformed.update((value : string | undefined) => (value ?? '') + '_');

    //console.log('watch', watch.mock.calls);

    expect(watch.mock.calls).to.deep.equal([
        // input, a, b, transformed, derived, smart
        [ [ 1, 'a', 'b', 'b', 'b', 'b' ] ], // initial
        [ [ 2, 'a', 'b', 'a', 'a', 'a' ] ], // input.set(2);
        [ [ 2, 'even', 'b', 'even', 'even', 'even' ] ], // a.set('even');
        [ [ 3, 'even', 'b', 'b', 'b', 'b' ] ], // input.set(3);
        [ [ 3, 'even', 'odd', 'odd', 'odd', 'odd' ] ], // b.set('odd');
        [ [ 4, 'even', 'odd', 'even', 'even', 'even' ] ], // transformed.set('even');
        [ [ 3, 'even', 'odd', 'odd', 'odd', 'odd' ] ], // transformed.set('odd');
        [ [ 4, 'even', 'odd', 'odd_', 'even', 'odd_' ] ] // transformed.update((value : string | undefined) => (value ?? '') + '_');
    ]);
});

it('should allow asymmetric transforms', () => {
    const base = writable(trigger_always, 1);
    const transformed = transform<number, string>(
        trigger_always,
        base,
        (num) => `#${num}`,
        (str, set) => {
            const num = parseInt(str.replace(/\D+/g, ''), 10);
            if (Number.isSafeInteger(num))
                set(num);
        }
    );

    const combined = derive(
        trigger_always,
        [base, transformed, transformed.derived$, transformed.smart$],
        ([base, transformed, derived, smart]) =>
            [base, transformed, derived, smart] as const
    );

    const watch = vi.fn();

    combined.subscribe(watch);

    transformed.set('#2');
    transformed.set('45');
    transformed.set('1,000');
    transformed.set('invalid');
    base.set(500);

    //console.log('calls', watch.mock.calls);

    expect(watch.mock.calls).to.deep.equal([
        // inner_value, outer_value, derived, smart
        [[1, '#1', '#1', '#1' ]],
        [[2, '#2', '#2', '#2']],
        [[45, '45', '#45', '45']],
        [[1000, '1,000', '#1000', '1,000']],
        [[1000, 'invalid', '#1000', '1,000']],
        [[500, '#500', '#500', '#500']],
    ]);
})
