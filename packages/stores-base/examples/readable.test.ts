import {expect, it} from "vitest";
import {readable, trigger_strict_not_equal} from "../src";
import {shim_console, shim_setTimeout} from "./_util";

it('example-readable-undefined', () => {
    const console = shim_console();

    // #region example-readable-undefined
    const store = readable(trigger_strict_not_equal);

    store.subscribe(value => { console.log('store value:', value) });

    // > store value: undefined
    // #endregion example-readable-undefined

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', undefined],
    ]);
});

it('example-readable-start', async () => {
    const console = shim_console();
    const setTimeout = shim_setTimeout();

    // #region example-readable-start
    const time = readable<Date | null>(trigger_strict_not_equal, null, (set) => {
        set(new Date());

        const intervalId = setTimeout(() => {
            set(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    });

    const unsubscribe = time.subscribe(value => { console.log('time is:', value) });

    // wait 1 second
    await new Promise(resolve => {
        setTimeout(resolve, 1000);
    });

    unsubscribe();

    // > time is: ...
    // > time is: ...

    // #endregion example-readable-start

    expect(console.log.mock.calls).to.have.length(2);
});
