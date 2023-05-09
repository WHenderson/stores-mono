import {StoreRunner} from "./types";
import {action_runner_throw_errors} from "./action-runner-throw-errors";

/**
 *  The active store runner used while executing actions queued with {@link enqueue_store_signals}
 *
 *  The store runner is primarily used for handling unhandled exceptions thrown by actions.
 *
 * _Example:_
 * {@codeblock ../stores-base-queue/examples/action-queue.test.ts#example-log-errors}
 *
 * @category Exception Handling
 */
export let actionRunner: StoreRunner = action_runner_throw_errors;

/**
 * Sets the active {@link actionRunner}
 *
 * @category Exception Handling
 * @param runner new actionRunner
 * @returns previous actionRunner
 */
export function set_store_runner(runner: StoreRunner): StoreRunner {
    const original = actionRunner;
    actionRunner = runner;
    return original;
}

/**
 * Returns the active actionRunner
 *
 * @category Exception Handling
 */
export function get_store_runner(): StoreRunner {
    return actionRunner;
}
