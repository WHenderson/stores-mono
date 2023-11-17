import {expect, it} from "vitest";
import {by_property} from "../src";
import {OptionalKeys} from "../src/util-types";

it('should access child properties', function () {
    interface Obj {
        a: number,
        b?: number
    }
    const original : Obj = { a: 1 };

    const selector_a = by_property<Obj, keyof Obj>('a');

    expect(selector_a.get(original)).toBe(1);
    expect(selector_a.update(original, 2)).to.deep.equal({ a: 2 });
    expect(selector_a.update(original, 1)).toBe(original);

    const selector_b = by_property<Obj, OptionalKeys<Obj>>('b');

    expect(() => selector_b.get(original)).toThrow('property not found');
    expect(selector_b.update(original, 2)).to.deep.equal({ a: 1, b: 2 });
    expect(selector_b.delete(selector_b.update(original, 2))).to.deep.equal({ a: 1 });
    expect(selector_b.delete(original)).toBe(original);

    expect(original, 'original should not be mutated').to.deep.equal({ a: 1 });
});
