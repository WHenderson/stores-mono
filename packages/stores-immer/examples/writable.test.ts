import {expect, it} from "vitest";
import {get, writable} from "../src";
import {create_console} from "./_util";

it('should copy-on-write', () => {
    const console = create_console();

    // #region example-writable-copy-on-write
    const initial = [1,2,3];
    const store = writable([1,2,3]);
    store.subscribe(value => console.log(value));
    // > [ 1, 2, 3 ]

    store.update(value => {
        value.push(4);
        return value;
    })
    // > [ 1, 2, 3, 4 ]

    console.log(get(store) !== initial);
    // > true
    // #endregion example-writable-copy-on-write

    expect(console.log.mock.calls).to.deep.equal([
        [[1,2,3]],
        [[1,2,3,4]],
        [true]
    ]);
});
