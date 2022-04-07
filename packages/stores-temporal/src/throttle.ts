import {derive, Readable, trigger_always} from "@crikey/stores-base";

/**
 * Throttle changes from `store`.
 *
 * Changes from `store` beyond the frequency specified by `period_ms` will be discarded.
 *
 * ![throttle](../diagrams/throttle.drawio.svg)
 * ```
 *    +---+  +---+  +---+  +---+                 +---+  +---+  +---+  +---+
 *    |   |  |   |  |   |  |   |                 |   |  |   |  |   |  |   |
 * +--+ 1 +--+ 2 +--+ 3 +--+ 4 +-----------------+ 5 +--+ 6 +--+ 7 +--+ 8 +-------------->
 *    |   |  |   |  |   |  |   |                 |   |  |   |  |   |  |   |
 *    +---+  +---+  +---+  +---+                 +---+  +---+  +---+  +---+
 *      |      |             |                     |      |             |
 *      |      +-----+       +----+                |      +-----+       +----+
 *      |            |            |                |            |            |
 *      v            v            v                v            v            v
 *    +---+        +---+        +---+            +---+        +---+        +---+
 *    |   |        |   |        |   |            |   |        |   |        |   |
 * +--+ 1 +--------+ 2 +--------+ 4 +------------+ 5 +--------+ 6 +--------+ 8 +--------->
 *    |   |        |   |        |   |            |   |        |   |        |   |
 *    +---+        +---+        +---+            +---+        +---+        +---+
 *
 * ```
 * _Example_:
 * {@codeblock ../stores-temporal/examples/throttle.test.ts#example-throttle}
 *
 * @param store
 * @param period_ms
 */
export function throttle<T>(
    store: Readable<T>,
    period_ms: number
) : Readable<T>;

export function throttle<T>(
    store: Readable<T>,
    period_ms: number
) : Readable<T> {
    let last_time: number | undefined;

    return derive(
        trigger_always,
        store,
        (value, set) => {
            const now = Date.now();

            if (last_time === undefined || (now - last_time >= period_ms)) {
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
                    period_ms - (now - last_time)
                );

                return () => {
                    clearTimeout(timeout_id);
                }
            }
        },
        <T>undefined!
    );
}
