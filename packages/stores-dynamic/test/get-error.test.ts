import {expect, it} from "vitest";
import {constant_error, constant_value, get_error} from "../src";

it('should return the error', () => {
    const value = constant_error(1);
    expect(get_error(value)).toBe(1);
});

it('should return the undefined if no error', () => {
    const value = constant_value(1);
    expect(get_error(value)).toBeUndefined();
});
