import {Action} from "./types";

/**
 * Swallow exceptions thrown by action
 * @param action
 */
export function store_runner_hide_errors(action: Action) {
    try {
        action();
    }
    catch (ex) {
        // swallow the error
    }
}
