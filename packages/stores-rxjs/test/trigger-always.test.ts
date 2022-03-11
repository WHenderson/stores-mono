import {expect, it} from 'vitest'
import {trigger_always} from "../src";

it('should return true', () => {
    expect(trigger_always(true, undefined, undefined)).toBeTruthy();
    expect(trigger_always(false, undefined, undefined)).toBeTruthy();
    expect(trigger_always(false, 1, 2)).toBeTruthy();
});
