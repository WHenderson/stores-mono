import {it} from 'vitest'
import {create_store_runner_log_errors, enqueue_store_signals, set_store_runner} from "../src";

it('example', () => {
    // #region example

    const action_a = () => { console.log('action a') };
    const action_b = () => { console.log('action b') };

    enqueue_store_signals([
        action_a,
        action_b
    ]);

    // > action a
    // > action b

    // #endregion example
});

it('example-nested', () => {
    // #region example-nested

    enqueue_store_signals([
        () => { console.log("action 1") },
        () => {
            console.log("action 2");
            enqueue_store_signals([
                () => { console.log("action 5") },
                () => { console.log("action 6") }
            ]);
            console.log("action 3");
        },
        () => { console.log("action 4") },
    ]);

    // > action 1
    // > action 2
    // > action 3
    // > action 4
    // > action 5
    // > action 6

    // #endregion example-nested
});

it('example log errors', () => {
    // #region example-log-errors
    const original_runner = set_store_runner(create_store_runner_log_errors(console.log));
    try {
        enqueue_store_signals([
            () => { throw new Error('error 1'); },
            () => { throw new Error('error 2'); },
            () => { throw new Error('error 3'); }
        ]);

        console.log('done.');

        // > Error: error 1
        // > Error: error 2
        // > Error: error 3
        // > done.
    }
    finally {
        set_store_runner(original_runner);
    }
    // #endregion example-log-errors
});
