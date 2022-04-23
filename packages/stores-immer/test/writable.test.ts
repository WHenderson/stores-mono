import { expect, it, vi } from 'vitest'
import {writable} from "../src";
import {get} from "@crikey/stores-base";

it('mutations should trigger subscribers', () => {
    const value: Record<string,number> = {};
    const store = writable(value);
    const watcher = vi.fn();
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

it('should use immer when update through start', () => {
    const store = writable<{ a: number, b: {}} | undefined>(
        { a: 1, b: {} },
        ({ update }) => {
            update(value => {
                if (value) {
                    if (value.a === 3)
                        return undefined;

                    value.a += 1;
                }
                return value;
            });
        }
    );

    const values = [
        get(store),
        get(store),
        get(store)
    ];

    expect(values).to.deep.equal([
        { a: 2, b: {} },
        { a: 3, b: {} },
        undefined
    ]);

    expect(values[0]).not.toBe(values[1]);
    expect(values[0]!.b).toBe(values[1]!.b);
});

it('should be skip immer when setting through start', () => {
    const store = writable({ a: 1 }, (set) => {
        set({ a: 2 });
    });

    const values = [
        get(store),
        get(store)
    ];

    expect(values).to.deep.equal([
        { a: 2 },
        { a: 2 }
    ]);

    expect(values[0]).not.toBe(values[1]);
});
