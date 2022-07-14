import {expect, vi, it} from "vitest";
import {derive, writable, transform} from "../src";
import {ComplexSet, Set} from "@crikey/stores-base";

it('should transform values (sync read, sync write)', () => {
    const input = writable( 1);
    const transformed = transform(
        input,
        (value) => `#${value}`,
        (value : string) => parseInt(value.slice(1), 10)
    );

    const combined = derive(
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
    const input = writable(1);
    const transformed = transform(
        input,
        (value, set: ComplexSet<string | undefined>) => {
            set(`#${value}`)
        },
        (value : string | undefined, set: Set<number>) => {
            set(parseInt((value ?? '').slice(1), 10))
        }
    );

    const combined = derive(
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
    const input = writable(1);
    const a = writable('a');
    const b = writable('b');

    const transformed = transform(
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
    const base = writable(1);
    const transformed = transform<number, string>(
        base,
        (num) => `#${num}`,
        (str, set) => {
            const num = parseInt(str.replace(/\D+/g, ''), 10);
            if (Number.isSafeInteger(num))
                set(num);
        }
    );

    const combined = derive(
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
});

it('should update correctly when not subscribed', () => {
    const root = writable<Record<string, number>>({ a: 1});
    const transformed = transform<Record<string, number>, number>(
        root,
        (parent, set) => {
            set(parent['a']);
        },
        (child, { update }) => {
            update(parent => {
                parent['a'] = child;
                return parent;
            })
        },
        <any>undefined
    );

    transformed.update(_value => {
        return 2;
    });
});

it('should chain complex immer objects', () => {
    const root$ = writable<any>();

    const is_object = (value: any) : value is Record<string,any> =>
        value !== null && typeof value === 'object' && !Array.isArray(value);
    const is_array = (value: any) : value is any[] =>
        Array.isArray(value);

    const a$ = transform<any,object>(
        root$,
        (parent, set) => {
            parent = is_object(parent) ? parent : {};
            const child = is_object(parent.a) ? parent.a : {};
            set(child);
        },
        (child, { update }) => {
            update(parent => {
                parent = is_object(parent) ? parent : {};
                parent.a = child;
                return parent;
            });

        },
        {}
    );

    const b$ = transform<any,any[]>(
        a$,
        (parent, set) => {
            parent = is_object(parent) ? parent : {};
            const child = is_array(parent.b) ? parent.b : [];
            set(child);
        },
        (child, { update }) => {
            update(parent => {
                parent = is_object(parent) ? parent : {};

                parent.b = child;

                return parent;
            });
        },
        []
    );

    const b_length$ = transform<any[],number>(
        b$,
        (parent, set) => {
            if (!Array.isArray(parent))
                throw new Error('expected array');

            return set(parent.length);
        },
        (child, { update }) => {
            update(parent => {
                if (!Array.isArray(parent))
                    throw new Error('expected array');

                parent.length = child;
                return parent;
            })
        },
        0
    );

    const watch_root = vi.fn();
    root$.subscribe(watch_root);

    const watch_a = vi.fn();
    a$.subscribe(watch_a);

    const watch_b = vi.fn();
    b$.subscribe(watch_b);

    const watch_b_length = vi.fn();
    b_length$.subscribe(watch_b_length);

    //root$.set({ msg: 'root'});
    //a$.set({ msg: 'hmm '});
    b_length$.set(3);

    expect(watch_root.mock.calls).to.deep.equal([
        [ undefined ],
        [
            {
                a: {
                    b: Array(3)
                }
            }
        ]
    ]);
})
