import {noop, Subscriber, Unsubscriber} from "@crikey/stores-base";
import {DynamicReadable, DynamicResolved} from "./types";

/**
 * Create a simple store which always returns the same value upon subscription
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/constant.test.ts#example-constant}
 *
 * @category Create Store
 * @param value the constant value of the store
 */
export function constant<T>(value: DynamicResolved<T>): DynamicReadable<T> {
    const fixed = Object.assign({}, value, { is_static: true });

    return {
        subscribe(run: Subscriber<DynamicResolved<T>>): Unsubscriber {
            run(fixed);
            return noop;
        }
    }
}
