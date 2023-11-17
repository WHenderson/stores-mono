import {expect, it} from "vitest";
import {by_last_index} from "../src";

it('should access last element of array', function () {
    const original = [1]; // sparse array

    const selector_last = by_last_index<typeof original, (typeof original)[0]>();

    expect(selector_last.get(original)).toBe(1);
    expect(selector_last.update(original, 2)).to.deep.equal([2]);
    expect(selector_last.update(original, 1)).toBe(original);

    expect(original, 'original should not be mutated').to.deep.equal([1]);
});

it('should handle empty arrays', function () {
    const original: number[] = []; // sparse array

    const selector_last = by_last_index<typeof original, (typeof original)[0]>();

    expect(() => selector_last.get(original)).toThrow('array is empty');
    expect(() => selector_last.update(original, 2)).toThrow('array is empty');;

    const selector_last_def = by_last_index<typeof original, (typeof original)[0]>(() => 42);
    expect(selector_last_def.get(original)).toBe(42);
    expect(() => selector_last_def.update(original, 2)).toThrow('array is empty');;

});
