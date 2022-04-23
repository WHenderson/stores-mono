import {Action} from "./types";

/**
 * Do not handle exceptions thrown by action
 *
 * @category Predefined Store Runners
 * @param action
 */
export function store_runner_throw_errors(action: Action): void  {
    action();
}
