import {expect, it} from 'vitest'
import {traverse_delete} from "../src";

it('should return undefined', () => {
    expect(traverse_delete(undefined, [])).toBeUndefined();
    expect(traverse_delete(1, [])).toBeUndefined();
    expect(traverse_delete({}, [])).toBeUndefined();
});

it('should delete child elements', () => {
    const root = { a: 1 };
    expect(traverse_delete(root, ['a'])).toBe(root);
    expect(root).to.deep.equal({});
});

it('should set array elements to undefined', () => {
    const root = [1];
    expect(traverse_delete(root, [0])).toBe(root);
    expect(root).to.deep.equal([undefined]);
});

it('should ignore inaccessible paths', () => {
    const root = { a: 1, b: NaN, c: undefined, d: true, e: [1] };
    expect(root).to.deep.equal({ a: 1, b: NaN, c: undefined, d: true, e: [1] });

    expect(traverse_delete(root, ['x'])).toBe(root);
    expect(traverse_delete(root, ['a', 0])).toBe(root);
    expect(traverse_delete(root, ['b', 0])).toBe(root);
    expect(traverse_delete(root, ['c', 0])).toBe(root);
    expect(traverse_delete(root, ['d', 0])).toBe(root);
    expect(traverse_delete(root, ['a', 'x'])).toBe(root);
    expect(traverse_delete(root, ['b', 'x'])).toBe(root);
    expect(traverse_delete(root, ['c', 'x'])).toBe(root);
    expect(traverse_delete(root, ['d', 'x'])).toBe(root);
    expect(traverse_delete(root, ['e', 'x'])).toBe(root);

    expect(root).to.deep.equal({ a: 1, b: NaN, c: undefined, d: true, e: [1] });
});

