import {derive, Readable} from "@crikey/stores-base";
import {trigger_always} from "@crikey/stores-base";

/**
 * Debounce changes from `store`.
 *
 * Changes from `store` will be delayed by `delay_ms`. Fresh changes from `store`
 * will cancel any pending events, effectively discarding any changes with a higher frequency than `delay_ms`.
 *
 * ![debounce](../diagrams/debounce.drawio.svg)
 * ```
 *    +---+     +---+     +---+          +---+     +---+     +---+
 *    |   |     |   |     |   |          |   |     |   |     |   |
 * +--+ 1 +-----+ 2 +-----+ 3 +----------+ 4 +-----+ 5 +-----+ 6 +-------------->
 *    |   |     |   |     |   |          |   |     |   |     |   |
 *    +---+     +---+     +---+          +---+     +---+     +---+
 *                          |                                  |
 *                          +-----------+                      +-----------+
 *                                      |                                  |
 *                                      v                                  v
 *                                    +---+                              +---+
 *                                    |   |                              |   |
 * +----------------------------------+ 3 +------------------------------+ 6 +-->
 *                                    |   |                              |   |
 *                                    +---+                              +---+
 * ```
 * _Example_:
 * {@codeblock ../stores-temporal/examples/debounce.test.ts#example-debounce}
 *
 * @param store store to debounce
 * @param delay_ms number of ms to delay changes by
 * @param default_value optional initial value. If none is provided, the initial value of `store` is used.
 */
export function debounce<T>(store: Readable<T>, delay_ms: number, default_value?: T) : Readable<T> {
    let initialised = arguments.length > 2;

    return derive(
        trigger_always,
        store,
        (value, set) => {
            if (!initialised) {
                initialised = true;

                set(value);
                return;
            }

            const timeout_id = setTimeout(
                () => { set(value); },
                delay_ms
            );

            return () => {
                clearTimeout(timeout_id);
            }
        },
        default_value
    );
}
