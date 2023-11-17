import {expect, it} from "vitest";
import {by_property, by_property_get} from "../src";
import {OptionalKeys} from "../src/util-types";

it('should access child properties', function () {
    interface Obj {
        a: number,
        b?: number
    }
    const original : Obj = { a: 1 };

    const selector_a = by_property_get<Obj, keyof Obj>('a');

    expect(selector_a.get(original)).toBe(1);

    const selector_b = by_property_get<Obj, OptionalKeys<Obj>>('b');

    expect(() => selector_b.get(original)).toThrow('property not found');

    const selector_b_def = by_property<Obj, keyof Obj>('b', () => 42);
    expect(selector_b_def.get(original)).toBe(42);
});
