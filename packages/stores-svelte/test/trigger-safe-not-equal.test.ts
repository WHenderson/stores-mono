import {expect, it} from 'vitest';
import { trigger_safe_not_equal  } from '../src';

it.skip('should greedily return true for complex types', () => {
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
            expect(
                trigger_safe_not_equal(false, lhs, rhs) ===
                    trigger_safe_not_equal(true, lhs, rhs)
            ).toBeTruthy();

            // complex types should always trigger
            if ((typeof lhs === 'object' && lhs !== null) || (typeof rhs === 'object' && rhs !== null)) {
                expect(trigger_safe_not_equal(false, lhs, rhs)).toBeTruthy();
            }
            else
            // NaN vs NaN should not trigger
            if (typeof lhs === 'number' && isNaN(lhs) && typeof rhs === 'number' && isNaN(rhs)) {
                expect(trigger_safe_not_equal(false, lhs, rhs)).toBe(false);
            }
            // other types should match the strict not equals inequality
            else {
                expect(trigger_safe_not_equal(false, lhs, rhs)).toBe(lhs !== rhs);
            }
        });
    });
})
