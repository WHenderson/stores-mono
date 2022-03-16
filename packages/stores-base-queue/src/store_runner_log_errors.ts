import {Action} from "./types";

export type Logger = (error: any) => void;

/**
 * returns a store runner which logs exceptions to logger and swallows the exceptions
 * @param logger function called with the given exception
 */
export function store_runner_log_errors(logger: Logger = console.error): (action: Action) => void {
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
