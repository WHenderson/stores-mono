import {expect, it} from "vitest";
import {constant_value} from "../src";
import {get} from "@crikey/stores-base";

it('should produce a DynamicError', () => {
    const store = constant_value(1);

    expect(get(store)).to.deep.equal({ value: 1, is_static: true });
});
