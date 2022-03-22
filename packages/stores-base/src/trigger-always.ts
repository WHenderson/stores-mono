/**
 * Always return true
 *
 * @category Predefined Triggers
 * @param _initial ignored
 * @param _new_value new value
 * @param _old_value current value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function trigger_always<T>(_initial: boolean, _new_value: T, _old_value?: T): boolean {
    return true;
}
