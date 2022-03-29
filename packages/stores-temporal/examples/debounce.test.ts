import {expect, it} from "vitest";
import {shim_console} from "@crikey/stores-base/examples/_util";
import {writable} from "@crikey/stores-base";
import {trigger_strict_not_equal} from "@crikey/stores-base/src";
import {debounce} from "../src";

it('example-debounce', async () => {
    const console = shim_console();

    // #region example-debounce

    const store = writable(trigger_strict_not_equal, 1);

    const debounced = debounce(store, 50);

    debounced.subscribe(value => console.log(value));

    await new Promise(resolve => {
        setTimeout(resolve, 30);
    });
    store.set(2);
    await new Promise(resolve => {
        setTimeout(resolve, 30);
    });
    store.set(3);
    await new Promise(resolve => {
        setTimeout(resolve, 30);
    });
    store.set(4);

    await new Promise(resolve => {
        setTimeout(resolve, 100);
    });
    store.set(5);
    await new Promise(resolve => {
        setTimeout(resolve, 30);
    });
    store.set(6);
    await new Promise(resolve => {
        setTimeout(resolve, 30);
    });
    store.set(7);
    await new Promise(resolve => {
        setTimeout(resolve, 30);
    });
    store.set(8);
    await new Promise(resolve => {
        setTimeout(resolve, 100);
    });

    // > 1
    // > 4
    // > 8
    // #endregion example-debounce

    expect(console.log.mock.calls).to.deep.equal([
        [1],
        [4],
        [8],
    ]);
});
