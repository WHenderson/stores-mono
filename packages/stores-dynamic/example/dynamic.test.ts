import {expect, it} from "vitest";
import {shim_console} from "./_util";
import {readable} from "@crikey/stores-strict";
import {dynamic} from "../src";
import {get} from "@crikey/stores-base";

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
})
