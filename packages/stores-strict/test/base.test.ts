import * as base from '@crikey/stores-base';
import {expect, it} from "vitest";
import {get, constant, transform} from "../src";

it('should expose basic functions', () => {
    expect(get).toBe(base.get);
    expect(constant).toBe(base.constant);
    expect(transform).toBe(base.transform);
});
