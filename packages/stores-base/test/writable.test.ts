import { expect, it } from 'vitest'
import {get, trigger_always, writable} from "../src";

it('should update with each change', () => {
    const store = writable(trigger_always, 1);
    let count = 0;
    store.subscribe(_ => ++count);

    expect(get(store)).toBe(1);

    store.set(2);

    expect(get(store)).toBe(2);

    store.set(2);

    expect(get(store)).toBe(2);
    expect(count).toBe(3);
})
