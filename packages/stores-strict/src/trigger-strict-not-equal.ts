/**
 * Return true of old and new values are strictly not equal
 *
 * @param _initial ignored
 * @param a new value
 * @param b current value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trigger_strict_not_equal(_initial: boolean, a: any, b: any): boolean {
    return a !== b;
}
