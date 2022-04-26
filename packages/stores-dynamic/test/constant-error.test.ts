import {expect, it} from "vitest";
import {constant_error} from "../src";
import {get} from "@crikey/stores-base";

it('should produce a DynamicError', () => {
    const store = constant_error(1);

    expect(get(store)).to.deep.equal({ error: 1, is_static: true });
});
