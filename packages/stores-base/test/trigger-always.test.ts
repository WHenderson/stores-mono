import {trigger_always} from "../src";
import {expect, it} from "vitest";

it('should always return true', () => {
    expect(trigger_always(false, 1, 1)).toBeTruthy();
    expect(trigger_always(false, 1, 2)).toBeTruthy();
    expect(trigger_always(false, 2, 1)).toBeTruthy();
    expect(trigger_always(true, 1, 1)).toBeTruthy();
})
