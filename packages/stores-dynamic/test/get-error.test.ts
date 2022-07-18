import {assert, expect, it} from "vitest";
import {constant_error, constant_value, get, get_error, is_dynamic_error} from "../src";
import {is_readable} from "@crikey/stores-base/src";

it('should return the error', () => {
    const store = constant_error(1);
    assert(is_readable(store));
    expect(get_error(store)).toBe(1);

    const resolved = get(store);
    assert(is_dynamic_error(resolved));
    expect(get_error(resolved)).toBe(1);
});

it('should return undefined if no error', () => {
    const store = constant_value(1);
    assert(is_readable(store));
    expect(get_error(store)).toBeUndefined();

    const resolved = get(store);
    assert(!is_dynamic_error(resolved));
    expect(get_error(resolved)).toBeUndefined();
});
