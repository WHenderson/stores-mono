import {constant_error, constant_value, resolve} from "../src";
import {expect, it} from "vitest";

it('should get static values', () => {
    expect(resolve({ value: 1 })).toBe(1);
});

it('should throw static errors', () => {
    expect(() => resolve({ error: new Error('example') })).toThrow('example');
});

it('should get store values', () => {
    expect(resolve(constant_value(1))).toBe(1);
});

it('should throw store errors', () => {
    expect(() => resolve(constant_error(new Error('example')))).toThrow('example');
});
