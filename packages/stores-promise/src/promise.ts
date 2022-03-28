import {Readable, Unsubscriber} from "@crikey/stores-base";
import {Stateful} from "./types";

export function promise<T>(store: Readable<Stateful<T>>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        let unsubscribe: Unsubscriber | undefined;
        let settled = false;

        const settle = () => {
            settled = true;
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = undefined;
            }
        }

        unsubscribe = store.subscribe(value => {
            if (value.isRejected) {
                settle();
                reject(value.error);
            }
            else
            if (value.isFulfilled) {
                settle();
                resolve(value.value);
            }
        });

        if (settled) {
            settle();
        }
    })
}
