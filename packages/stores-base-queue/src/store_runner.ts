import {StoreRunner} from "./types";
import {store_runner_throw_errors} from "./store_runner_throw_errors";

/** store running used when executing actions from the store queue */
export let store_runner: StoreRunner = store_runner_throw_errors;

/**
 * Sets the current store_runner
 * @param runner new store_runner
 * @returns previous store_runner
 */
export function set_store_runner(runner: StoreRunner): StoreRunner {
    const original = store_runner;
    store_runner = runner;
    return original;
}

/**
 * Returns the current store_runner
 */
export function get_store_runner(): StoreRunner {
    return store_runner;
}
