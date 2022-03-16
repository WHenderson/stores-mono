import {Action} from "./types";
import {store_runner} from "./store_runner";

/**
 * fifo queue of subscription notification actions
 */
const queued_actions: Action[] = [];
let queue_aborted = false;

/**
 * Enqueue the provided actions using a FIFO queue.
 * If the queue is empty, the actions will begin being called (synchronously) immediately until the queue is exhausted.
 * If the queue is not empty, the actions will be enqueued and called once any actions ahead in the queue have been
 * exhausted.
 *
 * This queuing system ensures that all store subscribes are called in a consistent manner and aids in resolution of
 * the diamond dependency problem.
 * 
 * @param actions array of actions to enqueue
 */
export function enqueue_store_signals(actions: Action[]): void {
    const run_actions = !queued_actions.length || queue_aborted;
    queue_aborted = false;
    queued_actions.push(...actions);

    if (run_actions) {
        // run to exhaustion (or exception)
        // note: additional actions can be added to the queue whilst this loop is running
        let i = 0
        try {
            for (; i !== queued_actions.length; ++i) {
                store_runner(queued_actions[i]);
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
