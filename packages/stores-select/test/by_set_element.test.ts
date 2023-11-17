import {expect, it} from "vitest";
import {by_set_element} from "../src";

it('should access child properties', function () {
    const original = new Set(['a']);

    const selector_a = by_set_element<string>('a');

    expect(selector_a.get(original)).toBe(true);
    expect(selector_a.update(original, false)).to.deep.equal(new Set([]));
    expect(selector_a.update(original, true)).toBe(original);

    const selector_b = by_set_element<string>('b');

    expect(selector_b.get(original)).toBe(false);
    expect(selector_b.update(original, true)).to.deep.equal(new Set(['a','b']));
    expect(selector_b.delete(selector_b.update(original, true))).to.deep.equal(new Set(['a']));
    expect(selector_b.delete(original)).toBe(original);

    expect(original, 'original should not be mutated').to.deep.equal(new Set(['a']));
});
