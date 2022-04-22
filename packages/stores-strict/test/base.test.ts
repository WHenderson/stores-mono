import * as base from '@crikey/stores-base';
import {expect, it} from "vitest";
import {get, constant} from "../src";

it('should expose basic functions', () => {
    expect(get).toBe(base.get);
    expect(constant).toBe(base.constant);
});
