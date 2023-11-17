import {expect, it} from "vitest";
import {by_size} from "../src";

it('should access map/set size', function () {
    const original = new Set(['a']);

    const selector_size = by_size<typeof original>();

    expect(selector_size.get(original)).toBe(1);
});
