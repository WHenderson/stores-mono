import {Readable, Writable, writable, trigger_strict_not_equal} from "@crikey/stores-base";
import {describe, it} from "vitest";
import { debounce, throttle } from '../src';

let when_first_time: number | undefined;
let when_last_time: number | undefined;
function when(): string {
    const now = Date.now();
    if (when_first_time === undefined)
        when_first_time = now;
    if (when_last_time === undefined)
        when_last_time = now;

    const result = `${now - when_first_time}ms`.padStart(8) + `+${now - when_last_time}ms`.padStart(8);

    when_last_time = now;

    return result;
}

function log_updates(store: Readable<number>, name: string) {
    let last_value: number = 0;
    let last_time: number | undefined = undefined;
    store.subscribe(value => {
        const now = Date.now();

        if (last_time === undefined) {
            last_value = value;
            last_time = now;
        }

        console.log(when(), `${name} :`, value, `(+${value - last_value} / +${now - last_time}ms)`);

        last_value = value;
        last_time = now;
    });
}

function duration(ms: number): Promise<void> {
    console.log(when(), 'waiting :', ms);
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}

async function duration_update(ms: number, store: Writable<number>): Promise<void> {
    await duration(ms);
    store.update(value => value + ms);
}

function create_trigger_store(): Writable<number> {
    return writable(trigger_strict_not_equal, 0);
}

describe('debounce', () => {
    it('should discard high frequency updates', async () => {
        const trigger = create_trigger_store();
        log_updates(trigger, 'trigger');

        const debounced = debounce(
            trigger,
            500
        );
        log_updates(debounced, 'debounced');

        // high frequency updates should be ignored
        await duration_update(100, trigger);
        await duration_update(100, trigger);
        await duration_update(100, trigger);
        await duration_update(100, trigger);
        await duration_update(100, trigger);
        await duration_update(100, trigger);

        // no update for 500ms
        await duration(500);

    });
});

describe.only('throttle', () => {
    it.only('should trigger no more than once per period', async () => {
        const trigger = create_trigger_store();
        log_updates(trigger, 'trigger');

        const throttled = throttle(
            trigger,
            500
        );
        log_updates(throttled, 'throttled');

        // high frequency updates should be ignored
        await duration_update(150, trigger);
        await duration_update(150, trigger);
        await duration_update(150, trigger);

        // 500ms since last signal

        await duration_update(200, trigger);
        await duration_update(200, trigger);

        // 500ms since last signal

        await duration_update(200, trigger);
        await duration_update(200, trigger);

        // 500ms since last signal

        await duration(500);
    });
});
