import { expect, it } from 'vitest'
import { constant } from "../src";
import { get } from '@crikey/stores-base';

it('should be immutable', () => {
    const store = constant({ value: 1 });
    expect(get(store)).to.deep.equal({ value: 1, is_static: true });
    expect(get(store)).toBe(get(store));
});
