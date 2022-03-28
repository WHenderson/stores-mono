import {it} from "vitest";
import {readable} from "../src";

it('example-readable-undefined', () => {
    // #region example-readable-undefined
    const store = readable();

    store.subscribe(value => { console.log('store value:', value) });

    // > store value: undefined
    // #endregion example-readable-undefined
});

it('example-readable-start', async () => {
    // #region example-readable-start
    const time = readable<Date | null>(null, (set) => {
        set(new Date());

        const intervalId = setInterval(() => {
            set(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    });

    const unsubscribe = time.subscribe(value => { console.log('time is:', value) });

    // wait 1 second

    unsubscribe();

    // > time is: ...
    // > time is: ...

    // #endregion example-readable-start
});
