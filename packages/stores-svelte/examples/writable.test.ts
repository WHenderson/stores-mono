import {it} from "vitest";
import {writable} from "../src";

it('example-writable-undefined', () => {
    // #region example-writable-undefined

    // create a writable store
    const store = writable<number>();

    // log each store value
    store.subscribe(value => console.log(value))

    // set
    store.set(1);

    // update
    store.update(value => value === undefined ? 0 : value + 1);

    // set
    store.set(undefined);

    // > undefined
    // > 1
    // > 2
    // > undefined

    // #endregion example-writable-undefined
});

it('example-writable-default', () => {
    // #region example-writable-default

    // create a writable store
    const store = writable(42);

    // log each store value
    store.subscribe(value => console.log(value))

    // set
    store.set(1);

    // update
    store.update(value => value + 1);

    // > 42
    // > 1
    // > 2

    // #endregion example-writable-default
});

it('example-writable-start', () => {
    // #region example-writable-start

    // create a writable store
    const store = writable(42, () => {
        console.log('got a subscriber');
        return () => console.log('no more subscribers');
    });

    // log each store value
    const unsubscribe = store.subscribe(value => console.log(value))

    // set
    store.set(1);

    // update
    store.update(value => value + 1);

    unsubscribe();

    // > got a subscriber
    // > 42
    // > 1
    // > 2
    // > no more subscribers

    // #endregion example-writable-start
});

it('example-writable-start-set', async () => {
    // #region example-writable-start-set

    // create a writable store which updates asynchronously
    const store = writable(false, (set) => {
        const id = setTimeout(
            () => { set(true) },
            0
        );

        return () => {
            clearTimeout(id);
        };
    });

    // log each store value
    const unsubscribe = store.subscribe(value => console.log('store value:', value))

    // give time for an update
    await new Promise(resolve => {
        setTimeout(resolve, 0);
    });

    unsubscribe();

    // > store value: false
    // > store value: true

    // #endregion example-writable-start-set
});

it('example-writable-start-update', async () => {
    // #region example-writable-start-update

    // create a writable store which updates asynchronously
    const store = writable(5, ({ update }) => {
        const id = setTimeout(
            () => { update(value => value * 1000) },
            0
        );

        return () => {
            clearTimeout(id);
        };
    });

    // log each store value
    const unsubscribe = store.subscribe(value => console.log('store value:', value))

    // give time for an update
    await new Promise(resolve => {
        setTimeout(resolve, 0);
    });

    unsubscribe();

    // > store value: 5
    // > store value: 5000

    // #endregion example-writable-start-update
});
