import {derive, Readable} from "@crikey/stores-base";
import {trigger_always} from "@crikey/stores-base";

export function debounce<T>(store: Readable<T>, wait: number) : Readable<T> {
    let initialised = false;

    return derive(
        trigger_always,
        store,
        (value, set) => {
            if (!initialised) {
                initialised = true;

                set(value);
                return;
            }

            const timeout_id = setTimeout(
                () => { set(value); },
                wait
            );

            return () => {
                clearTimeout(timeout_id);
            }
        }
    );
}
