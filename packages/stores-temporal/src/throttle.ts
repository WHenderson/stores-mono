import {derive, Readable} from "@crikey/stores-base";
import {trigger_always} from "@crikey/stores-base";

export function throttle<T>(store: Readable<T>, period: number) : Readable<T> {
    let last_time: number | undefined;

    return derive(
        trigger_always,
        store,
        (value, set) => {
            const now = Date.now();

            if (last_time === undefined || (now - last_time >= period)) {
                last_time = now;
                set(value);

                return;
            }
            else {
                const timeout_id = setTimeout(
                    () => {
                        last_time = Date.now();
                        set(value);
                    },
                    period - (now - last_time)
                );

                return () => {
                    clearTimeout(timeout_id);
                }
            }
        }
    );
}
