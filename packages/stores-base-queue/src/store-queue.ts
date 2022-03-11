/** Generic action. */
export type Action = () => void;

/**
 * fifo queue of subscription notification actions
 */
const queued_actions: Action[] = [];

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
    const run_actions = !queued_actions.length;
    queued_actions.push(...actions);

    if (run_actions) {
        // run to exhaustion
        // note: additional actions can be added to the queue whilst this loop is running
        for (let i = 0; i !== queued_actions.length; ++i) {
            queued_actions[i]();
        }
        queued_actions.length = 0;
    }
}
