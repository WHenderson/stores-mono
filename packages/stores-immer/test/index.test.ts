import { expect, it } from 'vitest'
import * as immer from "../src";
import * as strict from "@crikey/stores-strict"

it('should be based on strict types', () => {
    expect(immer.readable).toBe(strict.readable);
})
