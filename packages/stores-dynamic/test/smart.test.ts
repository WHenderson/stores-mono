import {expect, it, vi} from "vitest";
import {constant, constant_value, DynamicValue, smart} from "../src";
import {is_readable} from "@crikey/stores-base";
import {readable} from "@crikey/stores-strict";

it('should resolve static stores into static values', () => {
    const store = constant_value(1);
    const resolved = smart(store);

    expect(resolved).to.deep.equal({ value: 1, is_const: true });
});

it('should resolve dynamic stores into dynamic values', () => {
    const store = constant({ value: 1, is_const: false });
    const resolved = smart(store);

    expect(is_readable(resolved)).toBeTruthy();
});

it('should resolve via the "in" operator', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_const: true }, watch);
    const resolved = smart(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect('value' in resolved).toBeTruthy();

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_const: true });

    expect(watch.mock.calls).toHaveLength(1);
});

it('should resolve via get', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_const: true }, watch);
    const resolved = smart(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect((<DynamicValue<number>>resolved).value).toBe(1);

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_const: true });

    expect(watch.mock.calls).toHaveLength(1);
});

it('should resolve via get', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_const: true }, watch);
    const resolved = smart(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect(Object.getOwnPropertyDescriptor(resolved, 'value')).to.deep.equal({
        configurable: true,
        enumerable: true,
        value: 1,
        writable: true
    });

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_const: true });

    expect(watch.mock.calls).toHaveLength(1);
});

it('should resolve via ownKeys', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_const: true }, watch);
    const resolved = smart(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect(Reflect.ownKeys(resolved).sort()).to.deep.equal(['is_const', 'value']);

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_const: true });

    expect(watch.mock.calls).toHaveLength(1);
});

it('should resolve via getOwnPropertyNames', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_const: true }, watch);
    const resolved = smart(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect(Object.getOwnPropertyNames(resolved).sort()).to.deep.equal(['is_const', 'value']);

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_const: true });

    expect(watch.mock.calls).toHaveLength(1);
});
