import { expect, it } from 'vitest'
import {enqueue_store_signals} from "../src";

it('should process queue in fifo order', () => {
    const order: number[] = [];

    enqueue_store_signals([
        () => order.push(1),
        () => {
            order.push(2);
            enqueue_store_signals([
                () => order.push(5),
                () => order.push(6)
            ]);
            order.push(3);
        },
        () => order.push(4)
    ]);

    order.push(7);

    enqueue_store_signals([
        () => order.push(8)
    ]);

    expect(order).to.deep.equal([1,2,3,4,5,6,7,8]);
});
