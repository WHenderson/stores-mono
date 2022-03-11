import { expect, it } from 'vitest'
import {constant} from "../src";
import {get} from "@crikey/stores-base";

it('should be immutable', () => {
    const store = constant(1);
    expect(get(store)).toBe(1);
    expect(get(store)).toBe(1);
});
