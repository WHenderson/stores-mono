import {expect, it} from "vitest";
import {DynamicValue, smart} from "../src";
import {get, readable} from "@crikey/stores-base";
import assert from "assert";
import {trigger_strict_not_equal} from "@crikey/stores-base";

type ExactType<A,B> = [A] extends [B]
    ? (
        [B] extends [A]
            ? true
            : never
        )
    : never;

function ts_assert<T extends boolean>(_condition: T) {
}

it('should correctly type resolved arguments', () => {
    const a = { value: 'a' };
    const b = { value: 1 };

    const derived = smart(
        trigger_strict_not_equal,
        [a,b],
        ([a,b], resolve) => {
            ts_assert<ExactType<typeof a, DynamicValue<string>>>(true);
            ts_assert<ExactType<typeof b, DynamicValue<number>>>(true);

            const aa = resolve(a);
            const bb = resolve(b);

            ts_assert<ExactType<typeof aa, string>>(true);
            ts_assert<ExactType<typeof bb, number>>(true);

            return { value: aa + bb };
        }
    );

    expect(derived).to.deep.equal({ value: 'a1' });
});

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


