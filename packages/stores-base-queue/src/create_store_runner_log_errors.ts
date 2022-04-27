import {Action} from "./types";

/**
 * Callback used to log errors
 */
export type Logger = (error: any) => void;

/**
 * returns a {@link StoreRunner} which logs exceptions to logger and swallows the exceptions.
 *
 * @category Predefined Store Runners
 * @param logger function called with the given exception
 */
export function create_store_runner_log_errors(logger: Logger = console.error): (action: Action) => void {
    return (action: Action) => {
        try {
            action();
        }
        catch(ex) {
            // log the error then swallow it
            logger(ex);
        }
    }
}
