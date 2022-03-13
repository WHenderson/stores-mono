import { expect, it, fn } from 'vitest'
import {writable} from "../src";

it.skip('all updates on objects should trigger subscribers', () => {
    const value = {};
    const store = writable(value);
    const watcher = fn();
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

