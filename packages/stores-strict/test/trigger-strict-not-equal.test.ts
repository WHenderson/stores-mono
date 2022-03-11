import {expect, it} from 'vitest'
import {trigger_strict_not_equal} from "../src";

it('should return true when strictly not equal', () => {
    const values = [
        undefined,
        null,
        false,
        true,
        NaN,
        Infinity,
        -Infinity,
        0,
        0.5,
        1,
        'string',
        { obj: 1 },
        { obj: 2 },
        [1],
        [2],
        Symbol('a'),
        Symbol('b')
    ];

    values.forEach(lhs => {
        values.forEach(rhs => {
            expect(trigger_strict_not_equal(false, lhs, rhs)).toBe(lhs !== rhs);
            expect(trigger_strict_not_equal(true, lhs, rhs)).toBe(lhs !== rhs);
        });
    });
});
