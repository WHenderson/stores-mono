import {it} from "vitest";
import {get, trigger_strict_not_equal, writable} from "../src";

it('example-get', () => {
    // #region example-get
    const store = writable(trigger_strict_not_equal, 42);

    console.log(get(store)); // > 42
    // #endregion example-get
});
