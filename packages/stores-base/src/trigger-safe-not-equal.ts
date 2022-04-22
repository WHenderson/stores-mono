/**
 * Emulate svelte style store triggers.
 * Notably,
 * * always trigger when the new value is an object or a function
 * * dont trigger if the new value is NaN and the old value is NaN
 * 
 * @param _initial ignored
 * @param a new value
 * @param b current value
 */
export function trigger_safe_not_equal<T>(_initial: boolean, a: T, b?: T): boolean {
    return a != a ? b == b : a !== b || ((!!a && typeof a === 'object') || typeof a === 'function');
}
