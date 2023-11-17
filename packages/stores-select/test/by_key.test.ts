import {expect, it} from "vitest";
import {by_key} from "../src";

it('should access child properties', function () {
    const original = new Map([['a', 1]]);

    const selector_a = by_key<string, number>('a');

    expect(selector_a.get(original)).toBe(1);
    expect(selector_a.update(original, 2)).to.deep.equal(new Map([['a', 2]]));
    expect(selector_a.update(original, 1)).toBe(original);
 
    const selector_b = by_key<string, number>('b');

    expect(() => selector_b.get(original)).toThrow('key not found');
    expect(selector_b.update(original, 2)).to.deep.equal(new Map([['a', 1],['b', 2]]));
    expect(selector_b.delete(selector_b.update(original, 2))).to.deep.equal(new Map([['a', 1]]));
    expect(selector_b.delete(original)).toBe(original);

    const selector_b_def = by_key<string, number>('b', () => 42);
    expect(selector_b_def.get(original)).toBe(42);

    expect(original, 'original should not be mutated').to.deep.equal(new Map([['a', 1]]));
});
