import {StoreRunner} from "./types";
import {store_runner_throw_errors} from "./store_runner_throw_errors";

/**
 *  The active store runner used while executing actions queued with {@link enqueue_store_signals}
 *
 *  The store runner is primarily used for handling unhandled exceptions thrown by actions.
 *
 * _Example:_
 * {@codeblock ../stores-base-queue/examples/store-queue.test.ts#example-log-errors}
 *
 * @category Exception Handling
 */
export let store_runner: StoreRunner = store_runner_throw_errors;

/**
 * Sets the active {@link store_runner}
 *
 * @category Exception Handling
 * @param runner new store_runner
 * @returns previous store_runner
 */
export function set_store_runner(runner: StoreRunner): StoreRunner {
    const original = store_runner;
    store_runner = runner;
    return original;
}

/**
 * Returns the active store_runner
 *
 * @category Exception Handling
 */
export function get_store_runner(): StoreRunner {
    return store_runner;
}
