import { expect, it, vi } from 'vitest'
import {writable} from "../src";

it('all updates on objects should trigger subscribers', () => {
    const value = {};
    const store = writable(value);
    const watcher = vi.fn();
    store.subscribe(watcher);

    expect(watcher).toHaveBeenCalledOnce();

    store.update(obj => {
        return obj;
    });

    store.update(obj => {
        return obj;
    });

    expect(watcher).toHaveBeenCalledTimes(3);
});

