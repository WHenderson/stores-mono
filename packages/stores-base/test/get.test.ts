import { expect, it } from 'vitest'
import {get, Invalidator, Readable, Subscriber, Unsubscriber} from "../src";

it('should return store contents', () => {
    const store: Readable<number> = {
        subscribe(run: Subscriber<number>, _invalidate?: Invalidator): Unsubscriber {
            run(1);
            return () => {};
        }
    };
    expect(get(store)).to.equal(1);
})
