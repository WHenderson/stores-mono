import {describe, expect, it} from "vitest";
import {get, writable} from "@crikey/stores-strict";
import {
    by_sparse_index,
    by_key,
    by_last_index,
    by_length,
    by_property,
    by_property_get,
    by_set_element,
    by_size,
    select, by_index
} from "../src";

describe('should select child properties', () => {
    it('by_property_get', () => {
        interface Obj {
            a: number,
            b?: number
        }
        const original: Obj = { a: 1 };
        const store = writable(original);

        const store_a = select(store, by_property_get('a'));

        expect(get(store_a)).toBe(1);

        const store_b = select(store, by_property_get('b'));

        expect(() => get(store_b)).toThrow('property not found');

        const store_b_def = select(store, by_property_get('b', () => 42));

        expect(get(store_b_def)).toBe(42);

        expect(original).to.deep.equal({ a: 1 })
    });

    it('by_property', () => {
        interface Obj {
            a: number,
            b?: number
        }
        const original: Obj = { a: 1 };
        const store = writable(original);

        const store_a = select(store, by_property('a'));

        expect(get(store_a)).toBe(1);

        store_a.set(2);
        expect(get(store)).deep.equal({ a: 2 });

        store_a.update(a => a*2);
        expect(get(store)).deep.equal({ a: 4 });

        const store_b = select(store, by_property('b'));

        expect(() => get(store_b)).toThrow('property not found');

        store_b.set(2);
        expect(get(store)).deep.equal({ a: 4, b: 2 });

        store_b.delete();
        expect(get(store)).deep.equal({ a: 4 });

        const store_b_def = select(store, by_property('b', () => 42));

        expect(get(store_b_def)).toBe(42);

        expect(original).to.deep.equal({ a: 1 })
    });

    it('by_key', () => {
        const original = new Map([['a',1]]);
        const store = writable(original);

        const store_a = select(store, by_key('a'));

        expect(get(store_a)).toBe(1);

        store_a.set(2);
        expect(get(store)).deep.equal(new Map([['a',2]]));

        store_a.update(a => a*2);
        expect(get(store)).deep.equal(new Map([['a',4]]));

        const store_b = select(store, by_key('b'));

        expect(() => get(store_b)).toThrow('key not found');

        store_b.set(2);
        expect(get(store)).deep.equal(new Map([['a',4], ['b', 2]]));

        store_b.delete();
        expect(get(store)).deep.equal(new Map([['a',4]]));

        const store_b_def = select(store, by_key('b', () => 42));

        expect(get(store_b_def)).toBe(42);

        expect(original).to.deep.equal(new Map([['a',1]]))
    });

    it('by_set_element', () => {
        const original = new Set(['a']);
        const store = writable(original);

        const store_a = select(store, by_set_element('a'));

        expect(get(store_a)).toBe(true);

        store_a.set(false);
        expect(get(store)).deep.equal(new Set([]));

        store_a.update(a => !a);
        expect(get(store)).deep.equal(new Set(['a']));

        store_a.delete();
        expect(get(store)).deep.equal(new Set([]));

        expect(original).to.deep.equal(new Set(['a']));
    });

    it('by_sparse_index', () => {
        const original = [1,,3]; // sparse array
        const store = writable(original);

        const store_0 = select(store, by_sparse_index(0));

        expect(get(store_0)).toBe(1);

        store_0.set(2);
        expect(get(store)).deep.equal([2,,3]);

        store_0.update(a => a!*2);
        expect(get(store)).deep.equal([4,,3]);

        const store_1 = select(store, by_sparse_index(1));

        expect(() => get(store_1)).toThrow('index not found');

        store_1.set(2);
        expect(get(store)).deep.equal([4,2,3]);

        store_1.delete();
        expect(get(store)).deep.equal([4,,3]);

        const store_1_def = select(store, by_sparse_index(1, () => 42));

        expect(get(store_1_def)).toBe(42);

        expect(original).to.deep.equal([1,,3]);
    });

    it('by_index', () => {
        const original = [1]; // sparse array
        const store = writable(original);

        const store_0 = select(store, by_index(0));

        expect(get(store_0)).toBe(1);

        store_0.set(2);
        expect(get(store)).deep.equal([2]);

        store_0.update(a => a!*2);
        expect(get(store)).deep.equal([4]);

        const store_1 = select(store, by_index(1));

        expect(() => get(store_1)).toThrow('index not found');

        store_1.set(2);
        expect(get(store)).deep.equal([4,2]);

        const store_2_def = select(store, by_index(2, () => 42));

        expect(get(store_2_def)).toBe(42);

        expect(original).to.deep.equal([1]);
    });

    it('by_last_index', () => {
        const original = [1]; // sparse array
        const store = writable(original);

        const store_last = select(store, by_last_index());

        expect(get(store_last)).toBe(1);

        store_last.set(2);
        expect(get(store)).deep.equal([2]);

        store_last.update(a => a*2);
        expect(get(store)).deep.equal([4]);

        expect(original).to.deep.equal([1]);
    });

    it('by_last_index (empty)', () => {
        const original: number[] = []; // sparse array
        const store = writable(original);

        const store_last = select(store, by_last_index());

        expect(() => get(store_last)).toThrow('array is empty');

        expect(() => store_last.set(2)).toThrow('array is empty');

        expect(() => store_last.update(a => a*2)).toThrow('array is empty');

        expect(original).to.deep.equal([]);
    });

    it('by_length', () => {
        const original = [1];
        const store = writable(original);

        const store_length = select(store, by_length());

        expect(get(store_length)).toBe(1);

        store_length.set(2);
        expect(get(store)).deep.equal([1,,]);

        store_length.update(a => a*2);
        expect(get(store)).deep.equal([1,,,,]);

        expect(original).to.deep.equal([1]);
    });

    it('by_size', () => {
        const original = new Set(['a']);
        const store = writable(original);

        const store_size = select(store, by_size());

        expect(get(store_size)).toBe(1);
    });

    it('deep children', () => {
        const original = {
            a: [
                new Map([['c', new Set(['d'])]])
            ]
        };

        const store = writable(original);

        const store_a = select(store, by_property('a'));
        expect(get(store_a)).toBe(original.a);

        const store_b = select(store, by_property('a'), by_sparse_index(0));
        expect(get(store_b)).toBe(original.a[0]);

        const store_c = select(store, by_property('a'), by_sparse_index(0), by_key('c'));
        expect(get(store_c)).toBe(original.a[0].get('c'));

        const store_d = select(store, by_property('a'), by_sparse_index(0), by_key('c'), by_set_element('d'));
        expect(get(store_d)).toBe(original.a[0].get('c')!.has('d'));

        store_d.set(false);
        expect(get(store)).to.deep.equal({
            a: [
                new Map([['c', new Set([])]])
            ]
        })

        expect(original).to.deep.equal({
            a: [
                new Map([['c', new Set(['d'])]])
            ]
        })
    });
})
