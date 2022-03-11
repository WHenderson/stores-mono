import {expect, fn, it} from 'vitest';
import {readable} from "../src";
import {Subscriber} from "@crikey/base";

it('all updates on objects should trigger subscribers', () => {
    const value = {};
    let set: Subscriber<typeof value>;
    const store = readable(value, (set_) => { set = set_; return } );
    const watcher = fn();
    store.subscribe(watcher);

    expect(watcher).toHaveBeenCalledOnce();

    set!(value);
    set!(value);

    expect(watcher).toHaveBeenCalledTimes(3);
});
