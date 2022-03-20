import { expect, it } from 'vitest'
import {Invalidate, read_only, Subscriber, Unsubscriber, Updater, Writable} from '../src';

it('should remove everything but the subscribe method', () => {
    const store: Writable<number> = {
        subscribe(run: Subscriber<number>, _invalidate?: Invalidate): Unsubscriber {
            run(1);
            return () => {};
        },
        set(_value: number) {
        },
        update(_updater: Updater<number>) {
        }
    }

    const roStore = read_only(store);

    expect(Object.keys(roStore)).to.deep.equal(['subscribe']);
    expect(roStore.subscribe).toBe(store.subscribe);
})
