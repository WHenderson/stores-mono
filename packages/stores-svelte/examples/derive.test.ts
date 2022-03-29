import {expect, it} from "vitest";
import {derive, writable} from "../src";
import {shim_console, shim_setInterval, shim_setTimeout} from "./_util";

const setTimeout = shim_setTimeout();
const setInterval = shim_setInterval();

it('example-derive-simple-single', () => {
    const console = shim_console();

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

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', 2],
        ['store value:', 4]
    ]);
});

it('example-derive-simple-add', () => {
    const console = shim_console();

    // #region example-derive-simple-add
    const store_a = writable(1);
    const store_b = writable(100);

    const summed = derive(
        [store_a, store_b],
        ([a, b]) => a + b
    );

    summed.subscribe(value => console.log('store value:', value));

    store_a.set(2);

    // > store value: 101
    // > store value: 102
    // #endregion example-derive-simple-add

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', 101],
        ['store value:', 102]
    ]);
});

it('example-derive-async-simple', async () => {
    const console = shim_console();

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

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', undefined],
        ['store value:', 1]
    ]);
});


it('example-derive-async-update', async () => {
    const console = shim_console();

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
        setTimeout(resolve, 3500);
    });

    // > store value: 0
    // > store value: 1
    // > store value: 2
    // > store value: 3
    // #endregion example-derive-async-update

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', 0],
        ['store value:', 1],
        ['store value:', 2],
        ['store value:', 3],
    ]);


});
