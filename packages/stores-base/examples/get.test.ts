import {expect, it} from "vitest";
import {get, trigger_strict_not_equal, writable} from "../src";
import {shim_console} from "./_util";

it('example-get', () => {
    const console = shim_console();

    // #region example-get
    const store = writable(trigger_strict_not_equal, 42);

    console.log(get(store)); // > 42
    // #endregion example-get

    expect(console.log.mock.calls).to.deep.equal([
        [42]
    ]);
});
