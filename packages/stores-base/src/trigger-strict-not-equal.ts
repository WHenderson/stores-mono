/**
 * Return true if old and new values are strictly not equal
 *
 * @category Predefined Triggers
 * @param _initial ignored
 * @param new_value new value
 * @param old_value current value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trigger_strict_not_equal<T>(_initial: boolean, new_value: T, old_value?: T): boolean {
    return new_value !== old_value;
}
