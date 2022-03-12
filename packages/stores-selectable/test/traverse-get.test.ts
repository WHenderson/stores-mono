import {expect, it} from 'vitest'
import {traverse_get} from "../src";

it('should get root node', () => {
    expect(traverse_get(undefined, [])).toBe(undefined);
    expect(traverse_get(1, [])).toBe(1);
});

it('should return undefined if path is not accessible', () => {
    expect(traverse_get(undefined, ['a'])).toBeUndefined();
    expect(traverse_get(NaN, ['a'])).toBeUndefined();
    expect(traverse_get(true, ['a'])).toBeUndefined();
    expect(traverse_get(1, ['a'])).toBeUndefined();
    expect(traverse_get({}, ['a'])).toBeUndefined();
    expect(traverse_get([], ['a'])).toBeUndefined();
});

it('should return the target value', () => {
    expect(traverse_get(1, [])).toBe(1);
    expect(traverse_get({a : 1}, ['a'])).toBe(1);
    expect(traverse_get([1], [0])).toBe(1);
    expect(traverse_get([{a: 1}], [0, 'a'])).toBe(1);
});
