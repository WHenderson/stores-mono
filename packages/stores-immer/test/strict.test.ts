import * as strict from '@crikey/stores-strict';
import {expect, it} from "vitest";
import {constant, derive, derived, get, readable, transform} from "../src";

it('should expose basic functions', () => {
    expect(readable).toBe(strict.readable);
    expect(derive).toBe(strict.derive);
    expect(derived).toBe(strict.derived);
    expect(transform).toBe(strict.transform);
    expect(get).toBe(strict.get);
    expect(constant).toBe(strict.constant);
});
