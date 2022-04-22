import {expect, it} from "vitest";
import {derive, derived} from "../src";

it('should alias derive/derived', () => {
    expect(derive).toBe(derived);
});
