import {trigger_strict_not_equal, writable} from "@crikey/stores-base";
import {expect, fn, it} from "vitest";
import {debounce} from '../src';

function duration(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}

it('should discard high frequency updates', async () => {
    const trigger = writable(trigger_strict_not_equal, 0);

    const debounced = debounce(
        trigger,
        50
    );

    const watch = fn();
    debounced.subscribe(watch);

    await duration(10);
    trigger.set(1);
    await duration(10);
    trigger.set(2);
    await duration(10);
    trigger.set(3);

    await duration(50);

    await duration(10);
    trigger.set(4);
    await duration(10);
    trigger.set(5);
    await duration(10);
    trigger.set(6);

    await duration(50);

    expect(watch.mock.calls).to.deep.equal([
        [0],
        [3],
        [6]
    ]);
});
