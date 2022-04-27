import {expect, it} from "vitest";
import {shim_console} from "./_util";
import {readable} from "@crikey/stores-strict";
import {dynamic, DynamicError, trigger_dynamic} from "../src";
import {get} from "@crikey/stores-base";
import {writable} from "@crikey/stores-strict";

it('example-to-dynamic', () => {
    const console = shim_console();

    // #region example-to-dynamic

    const store = readable(1);
    const derived = dynamic(store);

    console.log('derived value:', get(derived));

    // #endregion example-to-dynamic

    expect(console.log.mock.calls).to.deep.equal([
        ['derived value:', { value: 1 }],
    ]);
});

it('example-dynamic-static', () => {
    const console = shim_console();

    // #region example-dynamic-static

    const a = writable({ value: 0 });
    const b = writable({ value: 'b value' });
    const c = writable({ value: 'c value' });
    const derived = dynamic(
        trigger_dynamic(),
        (resolve) => {
            return resolve(a) % 2 === 0
            ? { value: resolve(b) }
            : { value: resolve(c) }
        }
    );

    derived.subscribe((value) => console.log('derived value:', value))

    a.set({ value: 1 });

    // > derived value: { value: 'b value', dependencies: [a, b] }
    // > derived value: { value: 'c value', dependencies: [a, c] }

    // #endregion example-dynamic-static

    expect(console.log.mock.calls).to.deep.equal([
        ['derived value:', { value: 'b value', dependencies: new Set([a, b]) }],
        ['derived value:', { value: 'c value', dependencies: new Set([a, c]) }],
    ]);
});


it('example-dynamic-errors', () => {
    const console = shim_console();

    // #region example-dynamic-errors

    const a = writable({ value: { prop: 1 } });
    const derived = dynamic(
        trigger_dynamic(),
        (resolve) => {
            try {
                return { value: resolve(a)['prop'] }
            }
            catch (ex) {
                // natural place for error handling
                throw ex;
            }
        }
    );

    derived.subscribe((value) => console.log('derived value:', value))

    // @ts-ignore
    a.set({ value: null });

    // > derived value: { value: 1, dependencies: [a] }
    // > derived value: { error: TypeError, dependencies: [a] }

    // #endregion example-dynamic-errors

    const error = (<DynamicError>get(derived)).error;

    expect(console.log.mock.calls).to.deep.equal([
        ['derived value:', { value: 1, dependencies: new Set([a]) }],
        ['derived value:', { error, dependencies: new Set([a]) }],
    ]);
});
