import {expect, it} from "vitest";
import {get, writable} from "@crikey/stores-strict";
import {by_combined, by_property, select} from "../src";

it('should select a child property', () => {
    interface Obj {
        a: number,
        b?: string
    }
    const original: Obj = { a: 1 };
    const store = writable(original);

    const store_a = select(store, by_property('a'));
    const store_b = select(store, by_property('b'));

    expect(get(store_a)).toBe(1);
    expect(() => get(store_b)).toThrow('property not found');

    store_a.set(2);
    expect(original.a).toBe(1);
    expect(get(store_a)).toBe(2);

    store_b.set('hello world');
    expect(original).not.toHaveProperty('b');
    expect(get(store_b)).toBe('hello world');
});

it('should select a child property', () => {
    interface Obj {
        a: {
            b: {
                c: {
                    d?: number;
                }
            }
        }
    }

    const original: Obj = {a: {b: { c: { }}}};
    const store = writable(original);

    const store_d = select(store, by_combined(by_property('a'), by_property('b'), by_property('c'), by_property('d', () => -1)));

    expect(get(store_d)).toBe(-1);
    store_d.set(1);
    expect(get(store_d)).toBe(1);
    store_d.update(x => x! + 1);
    expect(get(store_d)).toBe(2);

});
