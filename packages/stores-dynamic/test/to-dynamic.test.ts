import {expect, it} from 'vitest'
import {to_dynamic} from "../src";
import {writable} from "@crikey/stores-strict";
import {get} from "@crikey/stores-base";

it('should result in the derived value', () => {
    const derived = to_dynamic(writable(42));
    expect(get(derived)).to.deep.equal({ value: 42 });
});

