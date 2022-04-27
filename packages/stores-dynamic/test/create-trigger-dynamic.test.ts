import {expect, it} from 'vitest'
import { create_trigger_dynamic } from "../src";
import { trigger_strict_not_equal } from "@crikey/stores-base";

it('should only trigger on result change', () => {
    const trigger = create_trigger_dynamic(trigger_strict_not_equal, trigger_strict_not_equal);

    expect(trigger(false, { value: 1})).toBeTruthy();

    expect(trigger(false, { value: 1 }, { value: 1 })).toBeFalsy();
    expect(trigger(false, { value: 1 }, { value: 2 })).toBeTruthy();

    expect(trigger(false, { error: 1 }, { error: 1 })).toBeFalsy();
    expect(trigger(false, { error: 1 }, { error: 2 })).toBeTruthy();

    expect(trigger(false, { error: 1 }, { value: 1 })).toBeTruthy();
    expect(trigger(false, { value: 1 }, { error: 1 })).toBeTruthy();
});
