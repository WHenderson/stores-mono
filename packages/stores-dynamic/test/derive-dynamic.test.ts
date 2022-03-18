import {describe, expect, it} from 'vitest'
import {to_dynamic, derive_dynamic, DynamicResolved} from "../src";
import {trigger_strict_not_equal, writable} from "@crikey/stores-strict";
import {get} from "@crikey/stores-base";
import {derive} from "@crikey/stores-strict";

describe('static calculations', () => {
    it('static result should resolve with static values', () => {
        const derived = derive_dynamic(
            trigger_strict_not_equal,
            () => ({ value: 42 })
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('value', 42);
        expect(resolved.dependencies).toBeUndefined();
    });

    it('static input should resolve with static values', () => {
        const derived = derive_dynamic(
            trigger_strict_not_equal,
            [ { value: 'x' }, { value: 1 } ],
            (resolve, a, b) => ({ value: resolve(a) + resolve(b) })
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('value', 'x1');
        expect(resolved.dependencies).not.toBeUndefined();
        expect(resolved.dependencies!.size).toBe(2);
    });
});

describe('static errors', () => {
    it('static errors should resolve with static errors', () => {
        const derived = derive_dynamic(
            trigger_strict_not_equal,
            () => ({ error: 42 })
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('error', 42);
        expect(resolved.dependencies).toBeUndefined();
    });

    it('static exceptions should resolve to static errors', () => {
        const derived = derive_dynamic(
            trigger_strict_not_equal,
            () => { throw 42; }
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('error', 42);
        expect(resolved.dependencies).toBeUndefined();
    });

    it('input errors should resolve to static errors', () => {
        const derived = derive_dynamic(
            trigger_strict_not_equal,
            [ { value: 1 }, { value: 2, error: 42 }],
            (resolve, a, b) => ({ value: resolve(a) + resolve(b) })
        );
        const resolved = get(derived);
        expect(resolved).toHaveProperty('error', 42);
        expect(resolved.dependencies).not.toBeUndefined();
        expect(resolved.dependencies!.size).toBe(2);
    });
});

describe('dynamic calculations', () => {
    it('dynamic values should resolve dynamically', () => {
        const store = writable(1);
        let store_count = 0;
        store.subscribe(_ => ++store_count);

        const derived = derive_dynamic(
            trigger_strict_not_equal,
            (resolve) => {
                return { value: resolve(false, store) };
            }
        );
        let derived_count = 0;
        derived.subscribe(_ => ++derived_count);

        const resolved = get(derived);
        expect(resolved).toHaveProperty('value', 1);
        expect(resolved.dependencies).not.toBeUndefined();
        expect([...resolved.dependencies!.keys()]).to.deep.equal([store]);
        expect(derived_count).to.equals(store_count);

        store.set(2);
        expect(get(derived)).toHaveProperty('value', 2);
        expect(derived_count).to.equals(store_count);
    });

    it('dynamic inputs should resolve dynamically', () => {
        const store = writable(1);
        let store_count = 0;
        store.subscribe(_ => ++store_count);

        const dynamic_store = to_dynamic(trigger_strict_not_equal, store);
        let dynamic_store_count = 0;
        dynamic_store.subscribe(_ => ++dynamic_store_count);

        const derived = derive_dynamic(
            trigger_strict_not_equal,
            [ dynamic_store ],
            (resolve, a) => {
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

        const dynamic_store = to_dynamic(trigger_strict_not_equal, store);
        let dynamic_store_count = 0;
        dynamic_store.subscribe(_ => ++dynamic_store_count);

        const derived = derive_dynamic(
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

    it.only('complex dynamic calculations should resolve dynamically', () => {
        const store1 = writable(2);
        const a = derive(store1, value => value * 10);
        const dynamic_a = to_dynamic(trigger_strict_not_equal, a);
        const b = derive(store1, value => value * 100);
        const dynamic_b = to_dynamic(trigger_strict_not_equal, b);
        const c = derive(store1, value => value * 1000);
        const dynamic_c = to_dynamic(trigger_strict_not_equal, c);
        const store2 = writable(0.1);

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

        const derived = derive_dynamic(
            trigger_strict_not_equal,
            [dynamic_a, dynamic_b, dynamic_c],
            (resolve, a, b, _c) => {
                const value = (resolve(false, store1) % 2 === 0)
                    ? resolve(a) + resolve(b)
                    : resolve(b) + resolve(false, store2)

                return { value };
            }
        );

        let derived_count = 0;
        let resolved: DynamicResolved<number> = { value: 0 };
        derived.subscribe(v => {
            ++derived_count;
            resolved = v;
            console.log('derived', v.value, '-', [...v.dependencies!.keys()].map(k => names.get(k)).join(','));
        });

        expect(resolved).toHaveProperty('value', 2*10 + 2*100);
        expect(resolved.dependencies).not.toBeUndefined();
        expect([...resolved.dependencies!.keys()]).to.deep.equal([ store1, dynamic_a, dynamic_b]);
        expect(derived_count).toBe(1);

        console.log('-- store1.set(3);');
        store1.set(3);

        expect(resolved).toHaveProperty('value', 3*100 + 0.1);
        expect(resolved.dependencies).not.toBeUndefined();
        expect(derived_count).toBe(2);

        console.log('-- store2.set(0.2);');
        store2.set(0.2);

        expect(resolved).toHaveProperty('value', 3*100 + 0.2);
        expect(resolved.dependencies).not.toBeUndefined();
        expect(derived_count).toBe(3);
    });
});


