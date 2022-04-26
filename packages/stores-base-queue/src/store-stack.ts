import {RecursionError} from "./recursion-error";

export const store_stack = new Set<unknown>();

/**
 * Place a store on the stack for the duration of action.
 * If the store is already on the stack, throws an infinite recursion error.
 *
 * @param store
 * @param action
 */
export function store_stack_use<T = void>(store: unknown, action: () => T): T {
    store_stack_assert(store);

    store_stack.add(store);
    try {
        return action();
    }
    finally {
        store_stack.delete(store);
    }
}

export function store_stack_assert(store: unknown) {
    if (store_stack.has(store))
        throw new RecursionError();
}
