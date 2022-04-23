import {describe, expect, it} from 'vitest'
import {dynamic, DynamicReadable, DynamicResolved, DynamicValue, to_dynamic} from "../src";
import {derive, writable} from "@crikey/stores-strict";
import {constant, get, Readable, trigger_strict_not_equal} from "@crikey/stores-base";
import {trigger_always} from "@crikey/stores-base";

type ExactType<A,B> = [A] extends [B]
    ? (
        [B] extends [A]
            ? true
            : never
        )
    : never;

function ts_assert<T extends boolean>(_condition: T) {
}

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
        expect(resolved.dependencies).toBeUndefined();
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
    });


    it('should handle infinite recursion between n dynamics', () => {
        const n = 10;

        const stores : Readable<DynamicResolved<number>>[] = [...Array(n)].map((_, i) =>
            dynamic(trigger_always, (resolve) => {
                return { value: resolve(stores[i + 1 % n]) };
            })
        );

        stores.forEach((store, i) => {
            (<any>store).name = i;
        });

        stores.forEach((store) => {
            expect(get(store)).toHaveProperty('error');
        });
    });
});
