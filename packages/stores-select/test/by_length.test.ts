import {expect, it} from "vitest";
import {by_length} from "../src";

it('should access array length', function () {
    const original = ['a'];

    const selector_length = by_length<typeof original, (typeof original)[0]>();

    expect(selector_length.get(original)).toBe(1);
    expect(selector_length.update(original, 2)).to.deep.equal(['a',,]);
    expect(selector_length.update(original, 1)).toBe(original);

    expect(original, 'original should not be mutated').to.deep.equal(['a']);
});
