import { expect, it, fn } from 'vitest'
import {writable} from "../src";
import {get} from "@crikey/stores-base";

it('mutations should trigger subscribers', () => {
    const value: Record<string,number> = {};
    const store = writable(value);
    const watcher = fn();
    store.subscribe(watcher);

    expect(watcher).toHaveBeenCalledOnce();

    store.update(obj => {
        obj.a = 1;
        return obj;
    });

    store.update(obj => {
        return obj;
    });

    expect(watcher).toHaveBeenCalledTimes(2);
});

it('should be able to update to undefined', () => {
    const store = writable<number | undefined>(1);
    store.update(_ => undefined);
    expect(get(store)).toBeUndefined();
});
