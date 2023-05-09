import {Action} from "./types";

/**
 * Swallow exceptions thrown by `action`
 *
 * @category Predefined Store Runners
 * @param action
 */
export function actionRunnerHideErrors(action: Action): void  {
    try {
        action();
    }
    catch (ex) {
        // swallow the error
    }
}
