import {it} from "vitest";
import {create_pending} from "../src";

it('example-pending', () => {
    // #region example-pending
    const pending = create_pending(3);

    // pending state starts clean
    console.log(pending.is_dirty()); // true

    // any invalid items make the pending state dirty
    pending.invalidate(1);
    console.log(pending.is_dirty()); // false

    // validating all invalid items makes the pending state clean
    pending.validate(1);
    console.log(pending.is_dirty()); // true
    // #endregion example-pending
});
