import {it} from "vitest";
import {derive, writable} from "../src";
import {shim_setInterval, shim_setTimeout} from "./_util";

const setTimeout = shim_setTimeout();
const setInterval = shim_setInterval();

it('example-derive-simple-single', () => {
    // #region example-derive-simple-single
    const store_a = writable(1);

    const doubled = derive(
        store_a,
        a => a * 2
    );

    doubled.subscribe(value => console.log('store value:', value));

    store_a.set(2);

    // > store value: 2
    // > store value: 4
    // #endregion example-derive-simple-single
});

it('example-derive-simple-multiple', () => {
    // #region example-derive-simple-multiple
    const store_a = writable(1);
    const store_b = writable(100);

    const summed = derive(
        [store_a, store_b],
        ([a, b]) => a + b
    );

    summed.subscribe(value => console.log('store value:', value));

    store_a.set(2);

    // > store value: 101
    // > store value: 202
    // #endregion example-derive-simple-multiple
});

it('example-derive-async-simple', async () => {
    // #region example-derive-async-simple
    const store_a = writable(1);

    const delayed = derive(
        store_a,
        (a, set) => {
            const timeoutId = setTimeout(
                () => { set(a); },
                1000
            );

            return () => {
                clearTimeout(timeoutId);
            }
        }
    );

    delayed.subscribe(value => console.log('store value:', value));

    await new Promise(resolve => {
        setTimeout(resolve, 1000);
    });

    // > store value: undefined
    // > store value: 1
    // #endregion example-derive-async-simple
});


it('example-derive-async-update', async () => {
    // #region example-derive-async-update
    const store_a = writable(1);

    const auto_increment = derive(
        store_a,
        (a, { update }) => {
            const intervalId = setInterval(
                () => { update(value => value + a); },
                1000
            );

            return () => {
                clearTimeout(intervalId);
            }
        },
        0
    );

    auto_increment.subscribe(value => console.log('store value:', value));

    await new Promise(resolve => {
        setTimeout(resolve, 3000);
    });

    // > store value: 0
    // > store value: 1
    // > store value: 2
    // > store value: 3
    // #endregion example-derive-async-update
});
