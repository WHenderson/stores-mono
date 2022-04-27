import {expect, it, vi} from "vitest";
import {constant, constant_value, DynamicValue} from "../src";
import {auto_resolve} from "../src/auto-resolve";
import {is_readable} from "@crikey/stores-base";
import {readable} from "@crikey/stores-strict";

it('should resolve static stores into static values', () => {
    const store = constant_value(1);
    const resolved = auto_resolve(store);

    expect(resolved).to.deep.equal({ value: 1, is_static: true });
});

it('should resolve dynamic stores into dynamic values', () => {
    const store = constant({ value: 1, is_static: false });
    const resolved = auto_resolve(store);

    expect(is_readable(resolved)).toBeTruthy();
});

it('should resolve via the "in" operator', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_static: true }, watch);
    const resolved = auto_resolve(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect('value' in resolved).toBeTruthy();

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_static: true });

    expect(watch.mock.calls).toHaveLength(1);
});

it('should resolve via get', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_static: true }, watch);
    const resolved = auto_resolve(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect((<DynamicValue<number>>resolved).value).toBe(1);

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_static: true });

    expect(watch.mock.calls).toHaveLength(1);
});

it('should resolve via get', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_static: true }, watch);
    const resolved = auto_resolve(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect(Object.getOwnPropertyDescriptor(resolved, 'value')).to.deep.equal({
        configurable: true,
        enumerable: true,
        value: 1,
        writable: true
    });

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_static: true });

    expect(watch.mock.calls).toHaveLength(1);
});

it('should resolve via ownKeys', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_static: true }, watch);
    const resolved = auto_resolve(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect(Reflect.ownKeys(resolved).sort()).to.deep.equal(['is_static', 'value']);

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_static: true });

    expect(watch.mock.calls).toHaveLength(1);
});

it('should resolve via getOwnPropertyNames', () => {
    const watch = vi.fn();
    const store = readable({ value: 1, is_static: true }, watch);
    const resolved = auto_resolve(store);

    expect(watch.mock.calls).toHaveLength(0);

    expect(Object.getOwnPropertyNames(resolved).sort()).to.deep.equal(['is_static', 'value']);

    expect(watch.mock.calls).toHaveLength(1);

    expect(resolved).to.deep.equal({ value: 1, is_static: true });

    expect(watch.mock.calls).toHaveLength(1);
});
