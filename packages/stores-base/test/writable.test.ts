import { expect, it } from 'vitest'
import {get, writable} from "../src";

it('should update with each change', () => {
    const store = writable(() => true, 1);
    let count = 0;
    store.subscribe(_ => ++count);

    expect(get(store)).toBe(1);

    store.set(2);

    expect(get(store)).toBe(2);

    store.set(2);

    expect(get(store)).toBe(2);
    expect(count).toBe(3);
})
