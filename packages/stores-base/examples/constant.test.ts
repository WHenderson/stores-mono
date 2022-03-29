import {expect, it} from "vitest";
import {constant, get} from "../src";
import {shim_console} from "./_util";

it('example-constant', () => {
    const console = shim_console();

    // #region example-constant
    const store = constant(10);

    console.log('store value:', get(store));

    // > store value: undefined
    // #endregion example-constant

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', 10],
    ]);
});
