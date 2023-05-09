import {describe, expect, it, vi} from 'vitest'
import {
    enqueue_actions,
    get_store_runner,
    set_store_runner,
    actionRunnerHideErrors, createActionRunnerLogErrors,
    action_runner_throw_errors,
    StoreRunner
} from "../src";

it('should process queue in fifo order', () => {
    const order: number[] = [];

    enqueue_actions([
        () => order.push(1),
        () => {
            order.push(2);
            enqueue_actions([
                () => order.push(5),
                () => order.push(6)
            ]);
            order.push(3);
        },
        () => order.push(4)
    ]);

    order.push(7);

    enqueue_actions([
        () => order.push(8)
    ]);

    expect(order).to.deep.equal([1,2,3,4,5,6,7,8]);
});

describe('error handling', () => {

    const run = (runner: StoreRunner, action: () => void) => {
        const originalRunner = set_store_runner(runner);
        expect(get_store_runner()).to.equal(runner);
        try {
            action();
        } finally {
            expect(get_store_runner()).to.equal(runner);
            set_store_runner(originalRunner);
            expect(get_store_runner()).to.equal(originalRunner);
        }
    }

    it('should hide errors', () => {
        run(actionRunnerHideErrors, () => {
            let ran = false;
            enqueue_actions([
                () => { throw new Error('example'); },
                () => { ran = true; }
            ]);
            expect(ran).toBeTruthy();
        });
    });

    it('should log errors', () => {
        const errorFn = vi.fn();
        run(createActionRunnerLogErrors(errorFn), () => {
            let ran = false;
            enqueue_actions([
                () => { throw new Error('example'); },
                () => { ran = true; }
            ]);
            expect(errorFn).toHaveBeenCalledOnce();
            expect(ran).toBeTruthy();
        });
    });

    it('should throw errors', () => {
        run(action_runner_throw_errors, () => {
            let ran = false;
            expect(() => {
                enqueue_actions([
                    () => { throw new Error('example'); },
                    () => { ran = true; }
                ]);
            }).toThrow('example');
            expect(ran).toBeFalsy();

            let ranMore = false;
            enqueue_actions([ () => { ranMore = true; } ]); // do nothing, but kick off processing
            expect(ran).toBeTruthy();
            expect(ranMore).toBeTruthy();
        });
    });
});
