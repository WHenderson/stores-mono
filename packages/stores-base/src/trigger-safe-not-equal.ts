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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trigger_safe_not_equal(_initial: boolean, a: any, b: any): boolean {
    return a != a ? b == b : a !== b || ((!!a && typeof a === 'object') || typeof a === 'function');
}
