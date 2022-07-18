import {assert, expect, it} from "vitest";
import {constant_error, constant_value, get, get_value, is_dynamic_value} from "../src";
import {is_readable} from "@crikey/stores-base/src";

it('should return the value', () => {
    const store = constant_value(1);
    assert(is_readable(store));
    expect(get_value(store)).toBe(1);

    const resolved = get(store);
    assert(is_dynamic_value(resolved));
    expect(get_value(resolved)).toBe(1);
});

it('should return undefined if no value', () => {
    const store = constant_error(1);
    assert(is_readable(store));
    expect(get_value(store)).toBeUndefined();
    expect(get_value(store, 'default')).toBe('default');

    const resolved = get(store);
    assert(!is_dynamic_value(resolved));
    expect(get_value(resolved)).toBeUndefined();
    expect(get_value(resolved, 'default')).toBe('default');
});
