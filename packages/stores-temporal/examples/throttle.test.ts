import {expect, it} from "vitest";
import {shim_console} from "@crikey/stores-base/examples/_util";
import {writable} from "@crikey/stores-base";
import {trigger_strict_not_equal} from "@crikey/stores-base/src";
import {throttle} from "../src";

it('example-throttle', async () => {
    const console = shim_console();

    // #region example-throttle

    const store = writable(trigger_strict_not_equal, 1);

    const throttled = throttle(store, 100);

    throttled.subscribe(value => console.log(value));

    await new Promise(resolve => {
        setTimeout(resolve, 10);
    });
    store.set(2);
    await new Promise(resolve => {
        setTimeout(resolve, 10);
    });
    store.set(3);
    await new Promise(resolve => {
        setTimeout(resolve, 10);
    });
    store.set(4);

    await new Promise(resolve => {
        setTimeout(resolve, 150);
    });
    store.set(5);
    await new Promise(resolve => {
        setTimeout(resolve, 10);
    });
    store.set(6);
    await new Promise(resolve => {
        setTimeout(resolve, 10);
    });
    store.set(7);
    await new Promise(resolve => {
        setTimeout(resolve, 10);
    });
    store.set(8);
    await new Promise(resolve => {
        setTimeout(resolve, 150);
    });

    // > 1
    // > 4
    // > 5
    // > 8
    // #endregion example-throttle

    expect(console.log.mock.calls).to.deep.equal([
        [1],
        [4],
        [5],
        [8],
    ]);
});
