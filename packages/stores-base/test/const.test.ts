import { expect, it } from 'vitest'
import {get, constant} from "../src";

it('should be immutable', () => {
    const store = constant(1);
    expect(get(store)).toBe(1);
    expect(get(store)).toBe(1);
});
