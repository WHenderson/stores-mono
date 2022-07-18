import {assert, expect, it} from "vitest";
import {constant, get} from "../src";
import {is_readable} from "@crikey/stores-base/src";

it('should return the inner value', () => {
    const resolved = { value: 1 };
    const store = constant(resolved);
    assert(is_readable(store));
    expect(get(store)).to.deep.equal(Object.assign({ is_const: true }, resolved));
});
