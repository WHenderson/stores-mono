import {expect, it} from "vitest";
import {shim_console} from "@crikey/stores-base/examples/_util";
import {trigger_strict_not_equal, writable} from "@crikey/stores-base";
import {throttle} from "../src";

it('example-throttle', async () => {
    const console = shim_console();

    // #region example-throttle

    const wait = (ms: number) => new Promise(resolve => {
        setTimeout(resolve, ms);
    })

    const store = writable(trigger_strict_not_equal, 1);

    const throttled = throttle(store, 500);

    throttled.subscribe(value => console.log(value));

    await wait(10);
    store.set(2);
    await wait(10);
    store.set(3);
    await wait(10);
    store.set(4);

    await wait(500);
    store.set(5);
    await wait(200);
    store.set(6);
    await wait(200);
    store.set(7);
    await wait(200);
    store.set(8);
    await wait(600);

    // > 1
    // > 4
    // > 7
    // > 8
    // #endregion example-throttle

    expect(console.log.mock.calls).to.deep.equal([
        [1],
        [4],
        [7],
        [8],
    ]);
});
