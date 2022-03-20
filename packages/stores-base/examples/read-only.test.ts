import {it} from "vitest";
import {get, read_only, trigger_strict_not_equal, writable} from "../src";

it('example-read-only', () => {
    // #region example-read-only
    const rw_store = writable(trigger_strict_not_equal, 42);

    const ro_store = read_only(rw_store);

    console.log(Object.getOwnPropertyNames(rw_store)); // > [ 'set', 'update', 'subscribe' ]
    console.log(Object.getOwnPropertyNames(ro_store)); // > [ 'subscribe' ]
    // #endregion example-read-only
});
