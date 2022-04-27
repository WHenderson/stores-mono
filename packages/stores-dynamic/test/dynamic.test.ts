import {describe, expect, it, vi} from 'vitest'
import {dynamic, DynamicError, DynamicReadable, DynamicResolved, DynamicValue, get_value, to_dynamic} from "../src";
import {derive, writable} from "@crikey/stores-strict";
import {
    Action,
    ComplexSet,
    constant,
    get,
    Readable,
    RecursionError,
    Subscriber,
    trigger_always,
    trigger_strict_not_equal,
    Unsubscriber
} from "@crikey/stores-base";
import {get_store_runner, set_store_runner, store_runner_throw_errors, StoreRunner} from "@crikey/stores-base-queue";

type ExactType<A,B> = [A] extends [B]
    ? (
        [B] extends [A]
            ? true
            : never
        )
    : never;

function ts_assert<T extends boolean>(_condition: T) {
}

describe('to dynamic', () => {
    it('should result in the derived value', () => {
        const derived = dynamic(writable(42));
        expect(get(derived)).to.deep.equal({ value: 42 });
    });
});

describe('static calculations', () => {
    it('should correctly type resolved arguments', () => {
        const a = dynamic(constant('a'));
        const b = dynamic(constant(1));

        const derived = dynamic(
            trigger_strict_not_equal,
            [a,b],
            ([a,b], resolve) => {
                ts_assert<ExactType<typeof a, Readable<DynamicValue<string>>>>(true);
                ts_assert<ExactType<typeof b, Readable<DynamicValue<number>>>>(true);

                const aa = resolve(a);
                const bb = resolve(b);

                ts_assert<ExactType<typeof aa, string>>(true);
                ts_assert<ExactType<typeof bb, number>>(true);

                return { value: aa + bb };
            }
        );

        expect(get(derived)).to.have.ownProperty('value', 'a1');
    });

    it('static result should resolve with static values', () => {
        const derived = dynamic(
            trigger_strict_not_equal,
            () => ({ value: 42 })
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('value', 42);
        expect(resolved.dependencies).toBeUndefined();
    });

    it('static input should resolve with static values', () => {
        const derived = dynamic(
            trigger_strict_not_equal,
            [ { value: 'x' }, { value: 1 } ],
            ([a, b], { resolve }) => ({ value: resolve(a) + resolve(b) })
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('value', 'x1');
        expect(resolved.dependencies).toBeUndefined();
    });
});

describe('static errors', () => {
    it('static errors should resolve with static errors', () => {
        const derived = dynamic(
            trigger_strict_not_equal,
            () => ({ error: 42 })
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('error', 42);
        expect(resolved.dependencies).toBeUndefined();
    });

    it('static exceptions should resolve to static errors', () => {
        const derived = dynamic(
            trigger_strict_not_equal,
            () => { throw 42; }
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('error', 42);
        expect(resolved.dependencies).toBeUndefined();
    });

    it('input errors should resolve to static errors', () => {
        const derived = dynamic(
            trigger_strict_not_equal,
            [ { value: 1 }, { value: 2, error: 42 }],
            ([a, b], resolve) => ({ value: resolve(a) + resolve(b) })
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('error', 42);
        expect(resolved.dependencies).toBeUndefined();
    });
});

describe('async calculations', () => {
    it('should support empty cleanup', () => {
        const store = writable({ value: 1 });
        const derived = dynamic(
            trigger_strict_not_equal,
            (resolve, set) => {
                set({ value: resolve(store)});
            },
            { value: -1 }
        );

        const watch = vi.fn();
        derived.subscribe(watch);

        // force running of cleanup code
        store.set({ value: 2 });

        expect(get_value(derived)).toBe(get_value(store));
    });

    it('should support arbitrary cleanup', () => {
        const store = writable({ value: 1 });
        const watch_cleanup = vi.fn();
        const derived = dynamic(
            trigger_strict_not_equal,
            (resolve, set) => {
                set({ value: resolve(store)});
                return watch_cleanup;
            },
            { value: -1 }
        );

        const watch = vi.fn();
        const unsub = derived.subscribe(watch);

        // force running of cleanup code
        store.set({ value: 2 });

        expect(get_value(derived)).toBe(get_value(store));
        expect(watch_cleanup.mock.calls).to.have.lengthOf(1);

        unsub();
        expect(watch_cleanup.mock.calls).to.have.lengthOf(2);
    });

    it('should support async update failures', () => {
        const derived = dynamic(
            trigger_strict_not_equal,
            (_resolve, { update }) => {
                update(_value => {
                    throw new Error('explicit error')
                });
            },
            { value: -1 }
        );

        expect(() => get_value(derived)).toThrow('explicit error');
    })
});

describe('contract failures', () => {
    it('should detect subscribe failures', () => {
        const fake_store = {
            subscribe(_run: Subscriber<DynamicResolved<number>>): Unsubscriber {
                // deliberately do nothing to simulate contract failure
                return () => {};
            }
        };

        const derived = dynamic(
            trigger_strict_not_equal,
            (resolve) => {
                return { value: resolve(fake_store) }
            }
        );

        expect(() => get_value(derived)).toThrow(ReferenceError);
    });

    it('should detect invalid return types', () => {
        const derived = dynamic(
            trigger_strict_not_equal,
            () => {
                return <DynamicValue<number>><unknown>1;
            }
        );

        expect(() => get_value(derived)).toThrow(TypeError);
    });
});

describe('dynamic calculations', () => {
    it('dynamic values should resolve dynamically', () => {
        const store = writable(1);
        let store_count = 0;
        store.subscribe(_ => ++store_count);

        const dstore = dynamic(store);

        const derived = dynamic(
            trigger_strict_not_equal,
            (resolve) => {
                return { value: resolve(dstore) };
            }
        );
        let derived_count = 0;
        derived.subscribe(_ => ++derived_count);

        const resolved = get(derived);
        expect(resolved).toHaveProperty('value', 1);
        expect(resolved.dependencies).not.toBeUndefined();
        expect([...resolved.dependencies!.keys()]).to.deep.equal([dstore]);
        expect(derived_count).to.equals(store_count);

        store.set(2);
        expect(get(derived)).toHaveProperty('value', 2);
        expect(derived_count).to.equals(store_count);
    });

    it('dynamic inputs should resolve dynamically', () => {
        const store = writable(1);
        let store_count = 0;
        store.subscribe(_ => ++store_count);

        const dynamic_store = to_dynamic(store);
        let dynamic_store_count = 0;
        dynamic_store.subscribe(_ => ++dynamic_store_count);

        const derived = dynamic(
            trigger_strict_not_equal,
            [ dynamic_store ],
            ([a], resolve) => {
                return { value: resolve(a) };
            }
        );
        let derived_count = 0;
        derived.subscribe(_ => ++derived_count);

        const resolved = get(derived);
        expect(resolved).toHaveProperty('value', 1);
        expect(resolved.dependencies).not.toBeUndefined();
        expect([...resolved.dependencies!.keys()]).to.deep.equal([dynamic_store]);
        expect(derived_count).to.equals(store_count);
        expect(derived_count).to.equals(dynamic_store_count);

        store.set(2);
        expect(store_count).to.equals(dynamic_store_count);

        expect(get(derived)).toHaveProperty('value', 2);
        expect(derived_count).to.equals(store_count);
        expect(derived_count).to.equals(dynamic_store_count);
    });

    it('dynamic results should resolve dynamically', () => {
        const store = writable(1);
        let store_count = 0;
        store.subscribe(_ => ++store_count);

        const dynamic_store = to_dynamic(store);
        let dynamic_store_count = 0;
        dynamic_store.subscribe(_ => ++dynamic_store_count);

        const derived = dynamic(
            trigger_strict_not_equal,
            () => {
                return dynamic_store;
            }
        );
        let derived_count = 0;
        derived.subscribe(_ => ++derived_count);

        const resolved = get(derived);
        expect(resolved).toHaveProperty('value', 1);
        expect(resolved.dependencies).to.have.lengthOf(1);
        expect(derived_count).to.equals(store_count);
        expect(derived_count).to.equals(dynamic_store_count);

        store.set(2);
        expect(store_count).to.equals(dynamic_store_count);

        expect(get(derived)).toHaveProperty('value', 2);
        expect(derived_count).to.equals(store_count);
        expect(derived_count).to.equals(dynamic_store_count);
    });

    it('complex dynamic calculations should resolve dynamically', () => {
        const store1 = writable(2);
        const dynamic_store1 = dynamic(store1);
        const a = derive(store1, value => value * 10);
        const dynamic_a = dynamic(a);
        const b = derive(store1, value => value * 100);
        const dynamic_b = dynamic(b);
        const c = derive(store1, value => value * 1000);
        const dynamic_c = dynamic(c);
        const store2 = writable(0.1);
        const dynamic_store2 = dynamic(store2);

        const set_name = (store: any, name: string) => { store.name = name; };

        const names = new Map<any, string>([
            [store1, 'store1'],
            [a, 'a'],
            [dynamic_a, 'dynamic_a'],
            [b, 'b'],
            [dynamic_b, 'dynamic_b'],
            [c, 'c'],
            [dynamic_c, 'dynamic_c'],
            [store2, 'store2']
        ]);
        names.forEach((name, store) => set_name(store, name));

        const derived = dynamic(
            trigger_strict_not_equal,
            [dynamic_a, dynamic_b, dynamic_c],
            ([a, b, _c], resolve) => {
                const value = (resolve(dynamic_store1) % 2 === 0)
                    ? resolve(a) + resolve(b)
                    : resolve(b) + resolve(dynamic_store2)

                return { value };
            }
        );

        let derived_count = 0;
        let resolved: DynamicResolved<number> = { value: 0 };
        derived.subscribe(v => {
            ++derived_count;
            resolved = v;
            //console.log('derived', (<any>v).value, '-', [...v.dependencies!.keys()].map(k => names.get(k)).join(','));
        });

        expect(resolved).toHaveProperty('value', 2*10 + 2*100);
        expect(resolved.dependencies).not.toBeUndefined();
        expect([...resolved.dependencies!.keys()]).to.deep.equal([ dynamic_store1, dynamic_a, dynamic_b]);
        expect(derived_count).toBe(1);

        //console.log('-- store1.set(3);');
        store1.set(3);

        expect(resolved).toHaveProperty('value', 3*100 + 0.1);
        expect(resolved.dependencies).not.toBeUndefined();
        expect([...resolved.dependencies!.keys()]).to.deep.equal([ dynamic_store1, dynamic_b, dynamic_store2]);
        expect(derived_count).toBe(2);

        //console.log('-- store2.set(0.2);');
        store2.set(0.2);

        expect(resolved).toHaveProperty('value', 3*100 + 0.2);
        expect(resolved.dependencies).not.toBeUndefined();
        expect(derived_count).toBe(3);
    });
});

describe('infinite recursion', () => {
    it('should handle infinite recursion of self', () => {
        const a : DynamicReadable<number> = dynamic(trigger_always, (resolve) => {
            return { value: resolve(a) };
        });

        expect(get(a)).toHaveProperty('error');
        expect((<DynamicError>get(a)).error).toBeInstanceOf(RecursionError);
    });

    it('should handle infinite recursion between two dynamics', () => {
        const a : DynamicReadable<number> = dynamic(trigger_always, (resolve) => {
            return { value: resolve(b) };
        });
        const b : DynamicReadable<number> = dynamic(trigger_always, (resolve) => {
            return { value: resolve(a) };
        });

        (<any>a).name = 'a';
        (<any>b).name = 'b';

        expect(get(a)).toHaveProperty('error');
        expect(get(b)).toHaveProperty('error');
        expect((<DynamicError>get(a)).error).toBeInstanceOf(RecursionError);
        expect((<DynamicError>get(b)).error).toBeInstanceOf(RecursionError);
    });


    it('should handle infinite recursion between n dynamics', () => {
        const n = 10;

        const stores : Readable<DynamicResolved<number>>[] = [...Array(n)].map((_, i) =>
            dynamic(trigger_always, (resolve) => {
                return { value: resolve(stores[(i + 1) % n]) };
            })
        );

        stores.forEach((store, i) => {
            (<any>store).name = i;
        });

        stores.forEach((store) => {
            expect(get(store)).toHaveProperty('error');
            expect((<DynamicError>get(store)).error).toBeInstanceOf(RecursionError);
        });
    });
});

describe('simulate derive', () => {
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
        const a = constant({ value: 'a' });
        const b = constant({ value: 1 });

        const derived = dynamic(
            trigger_strict_not_equal,
            [a,b],
            ([arg_a, arg_b], resolve) => {
                ts_assert<ExactType<typeof arg_a, typeof a>>(true);
                ts_assert<ExactType<typeof arg_b, typeof b>>(true);

                const resolved_a = resolve(a);
                const resolved_b = resolve(b);

                ts_assert<ExactType<typeof resolved_a, string>>(true);
                ts_assert<ExactType<typeof resolved_b, number>>(true);

                return { value: `${resolved_a}${resolved_b}` };
            }
        );

        expect((<DynamicValue<string>>get(derived)).value).toBe('a1');
    });

    it('should only trigger once all dependencies are ready', () => {
        // diamond dependency problem

        const root = writable({ value: 1 });

        const lhs = dynamic(
            trigger_strict_not_equal,
            (resolve) =>
                ({ value: resolve(root) * 10 })
        );

        const rhs = dynamic(
            trigger_strict_not_equal,
            (resolve) =>
                ({ value: resolve(root) * 100 })
        );

        const combined = dynamic(
            trigger_strict_not_equal,
            [lhs, rhs],
            ([lhs, rhs], resolve) =>
                ({ value: resolve(lhs) + resolve(rhs) })
        );

        const watch = vi.fn();
        combined.subscribe(watch);

        root.set({ value: 2 });
        root.set({ value: 3 });
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            110,
            220,
            330
        ]);
    });

    it('should support async resolution', () => {
        let set: ComplexSet<DynamicResolved<number>>;
        const derived = dynamic(
            trigger_strict_not_equal,
            (_resolve, set_) => {
                set = set_;
            },
            {  value: -1 }
        );

        const watch = vi.fn();
        derived.subscribe(watch);
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            -1
        ]);

        set!({ value: 2});
        set!({ value: 3});
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            -1,
            2,
            3
        ]);
    });

    it('should support async update', () => {
        const a = writable({ value: 1 });
        const store = dynamic(
            trigger_strict_not_equal,
            (resolve, { update }) => {
                update(
                    current =>
                        ({ value: resolve(current) + resolve(a) })
                );
            },
            { value: 0 }
        );

        expect(get_value(store)).toBe(1);

        a.set({ value: 2 });
        expect(get_value(store)).toBe(3);

        a.set({ value: 3 });
        expect(get_value(store)).toBe(6);
    });

    it('should wait until all dependencies are valid', () => {
        let a_set: ComplexSet<DynamicValue<number>> = undefined!;
        const a = writable({ value: 1 }, (set) => {
            a_set = set;
        });
        const b = writable({ value: 10 });
        const derived = dynamic(
            trigger_always,
            (resolve) =>
                ({ value: resolve(a) + resolve(b) })
        );
        const watch = vi.fn();

        // initial subscription
        derived.subscribe(watch);
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            11
        ]);

        // ensure changes are propagating
        b.set({ value: 20 });
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            11,
            21
        ]);

        // ensure deriving is delayed whilst dependencies are invalid
        a_set.invalidate();
        b.set({ value: 30 });
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            11,
            21
        ]);

        // ensure deriving picks up once dependencies are revalidated
        a_set.revalidate();
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            11,
            21,
            31
        ]);

        // ensure toggling validity doesn't automatically cause a derivation
        a_set.invalidate();
        a_set.revalidate();
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            11,
            21,
            31
        ]);

        // ensure erroneous revalidation does nothing
        a_set.revalidate();
        a_set.revalidate();
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            11,
            21,
            31
        ]);

        // ensure triggers cause revalidation as necessary
        a_set.invalidate();
        a_set.set(get(a));
        expect(watch.mock.calls.map(call => (<DynamicValue<number>>call[0]).value)).to.deep.equal([
            11,
            21,
            31
        ]);
    });


    const run = (runner: StoreRunner, action: Action) => {
        const originalRunner = set_store_runner(runner);
        expect(get_store_runner()).to.equal(runner);
        try {
            action();
        } finally {
            expect(get_store_runner()).to.equal(runner);
            set_store_runner(originalRunner);
            expect(get_store_runner()).to.equal(originalRunner);
        }
    }

    it('should perform cleanup even during an unhandled exception', () => {
        run(store_runner_throw_errors, () => {
            const a = writable({ value: 1});
            const derived = dynamic(trigger_always, (resolve) => {
                resolve(a);
                throw Error('unhandled exception');
            });

            expect(() => get_value(derived)).toThrow('unhandled exception');

            expect(() => {
                a.set({ value: 2 });
            }).not.toThrow();
        });
    });
})
