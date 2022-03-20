import {Action} from "./types";

/**
 * Swallow exceptions thrown by `action`
 *
 * @category Predefined Store Runners
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
