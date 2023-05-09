import {Action} from "./types";
import {actionRunner} from "./action-runner";

/**
 * fifo queue of subscription notification actions
 */
const queued_actions: Action[] = [];
let queue_aborted = false;

/**
 * Add actions to the end of the global action FIFO queue.
 *
 * If the queue is empty, the actions are placed on the queue and begin executing immediately.
 * Execution continues until the queue is exhausted, including any actions added during this process.
 * Only once the queue is empty does the function return.
 *
 * If the queue is not empty, the actions are added to the queue and the function returns immediately.
 *
 * _Example:_
 * {@codeblock ../stores-base-queue/examples/action-queue.test.ts#example}
 *
 * _Example with nesting:_
 * {@codeblock ../stores-base-queue/examples/action-queue.test.ts#example-nested}
 *
 * @category Core
 * @param actions array of actions to enqueue
 */
export function enqueue_actions(actions: Action[]): void {
    const run_actions = !queued_actions.length || queue_aborted;
    queue_aborted = false;
    queued_actions.push(...actions);

    if (run_actions) {
        // run to exhaustion (or exception)
        // note: additional actions can be added to the queue whilst this loop is running
        let i = 0
        try {
            for (; i !== queued_actions.length; ++i) {
                actionRunner(queued_actions[i]);
            }
            queued_actions.length = 0;
        }
        catch (ex) {
            queued_actions.splice(0, i + 1); // take everything which has been processed off of the queue
            queue_aborted = true;
            throw ex; // rethrow
        }
    }
}
