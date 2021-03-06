import {Readable, Subscriber, Unsubscriber} from "./types";
import {noop} from "./noop";

/**
 * Create a simple store which always returns the same value upon subscription
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/constant.test.ts#example-constant}
 *
 * @category Create Store
 * @param value the constant value of the store
 */
export function constant<T>(value: T): Readable<T> {
    return {
        subscribe(run: Subscriber<T>): Unsubscriber {
            run(value);
            return noop;
        }
    }
}
