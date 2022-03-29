import {expect, it} from "vitest";
import {create_pending} from "../src";
import {shim_console} from "./_util";

it('example-pending', () => {
    const console = shim_console();

    // #region example-pending
    const pending = create_pending(3);

    // pending state starts clean
    console.log(pending.is_dirty()); // false

    // any invalid items make the pending state dirty
    pending.invalidate(1);
    console.log(pending.is_dirty()); // true

    // validating all invalid items makes the pending state clean
    pending.validate(1);
    console.log(pending.is_dirty()); // false
    // #endregion example-pending

    expect(console.log.mock.calls).to.deep.equal([
        [false],
        [true],
        [false]
    ]);
});
