import {expect, it} from "vitest";
import {smart} from "../src";
import {get, readable, trigger_strict_not_equal} from "@crikey/stores-base";
import assert from "assert";

it('should resolve with constant inputs', () => {
    const store = smart(
        trigger_strict_not_equal,
        [
            { value: 1 },
            { value: 2 }
        ],
        ([a, b], resolve) => {
            return { value: resolve(a) + resolve(b) };
        }
    );

    expect(store).to.deep.equal({ value: 3 });
});

it('should resolve dynamic with dynamic result', () => {
    const store = smart(
        trigger_strict_not_equal,
        [
            { value: 1 },
            { value: 2 }
        ],
        ([a, b], resolve) => {
            return readable(
                trigger_strict_not_equal,
                { value: resolve(a) + resolve(b) }
            );
        }
    );

    assert('subscribe' in store);
    expect(get(store)).to.deep.equal({ value: 3 });
});

it('should resolve dynamic inputs dynamically', () => {
    //const store = dynamic(writable(trigger_strict_not_equal, 1));
});


