// noinspection JSMismatchedCollectionQueryUpdate

import {expect, vi, it} from 'vitest'
import {
    ComplexSet,
    constant,
    derive,
    get,
    readable,
    Set,
    trigger_always,
    trigger_strict_not_equal,
    writable
} from "../src";

type ExactType<A,B> = [A] extends [B]
    ? (
        [B] extends [A]
        ? true
        : never
    )
    : never;

function ts_assert<T extends boolean>(_condition: T) {
}

it('should correctly type resolved arguments', () => {
    const a = constant('a');
    const b = constant(1);

    const derived = derive(
        trigger_strict_not_equal,
        [a,b],
        ([a,b]) => {
            ts_assert<ExactType<typeof a, string>>(true);
            ts_assert<ExactType<typeof b, number>>(true);

            return a + b;
        }
    );

    expect(get(derived)).toBe('a1');
});

it('should only trigger once all dependencies are ready', () => {
    // diamond dependency problem

    const root = writable(trigger_strict_not_equal, 1);

    const lhs = derive(
        trigger_strict_not_equal,
        root,
        root => root * 10
    );

    const rhs = derive(
        trigger_strict_not_equal,
        root,
        root => root * 100
    );

    const combined = derive(
        trigger_strict_not_equal,
        [lhs, rhs],
        ([lhs, rhs]) => lhs + rhs
    );

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
    const root = readable(trigger_strict_not_equal, 1);

    let set: Set<number>;
    const derived = derive(
        trigger_strict_not_equal,
        root,
        (_root, set_: Set<number>) => {
            set = set_;
        },
        <number>-1
    );

    const watch = vi.fn();
    derived.subscribe(watch);
    expect(watch.mock.calls).to.deep.equal([[-1]])

    set!(2);
    set!(3);
    expect(watch.mock.calls).to.deep.equal([[-1], [2], [3]]);
});

it('should support async update', () => {
    const a = writable(trigger_strict_not_equal,1);
    const store = derive(
        trigger_strict_not_equal,
        a,
        (value, { update }) => {
            update(current => current + value);
        },
        0
    );

    expect(get(store)).toBe(1);

    a.set(2);
    expect(get(store)).toBe(3);

    a.set(3);
    expect(get(store)).toBe(6);
});

it('should wait until all dependencies are valid', () => {
    let a_set: ComplexSet<number> = undefined!;
    const a = writable(trigger_strict_not_equal, 1, (set) => {
        a_set = set;
    });
    const b = writable(trigger_always, 10);
    const derived = derive(trigger_always, [a,b], ([a,b]) => a + b);
    const watch = vi.fn();

    // initial subscription
    derived.subscribe(watch);
    expect(watch.mock.calls).to.deep.equal([
        [11]
    ]);

    // ensure changes are propagating
    b.set(20);
    expect(watch.mock.calls).to.deep.equal([
        [11],
        [21]
    ]);

    // ensure deriving is delayed whilst dependencies are invalid
    a_set.invalidate();
    b.set(30);
    expect(watch.mock.calls).to.deep.equal([
        [11],
        [21]
    ]);

    // ensure deriving picks up once dependencies are revalidated
    a_set.revalidate();
    expect(watch.mock.calls).to.deep.equal([
        [11],
        [21],
        [31],
    ]);

    // ensure toggling validity doesn't automatically a derivation
    a_set.invalidate();
    a_set.revalidate();
    expect(watch.mock.calls).to.deep.equal([
        [11],
        [21],
        [31],
    ]);

    // ensure erroneous revalidation does nothing
    a_set.revalidate();
    a_set.revalidate();
    expect(watch.mock.calls).to.deep.equal([
        [11],
        [21],
        [31],
    ]);

    // ensure triggers cause revalidation as necessary
    a_set.invalidate();
    a_set.set(1);
    expect(watch.mock.calls).to.deep.equal([
        [11],
        [21],
        [31],
    ]);
});
