import {expect, vi, it} from 'vitest'
import {Observable} from "rxjs";
import {readable} from "../src";

it('each fresh subscription should receive all constructor signals', () => {
    const observable = new Observable(subscriber => {
        // constructor signals
        subscriber.next(1);
        subscriber.next(2);
    });
    const store = readable(observable);
    const watcher1 = vi.fn();
    const watcher2 = vi.fn();

    store.subscribe(watcher1);
    store.subscribe(watcher2);

    expect(watcher1.mock.calls).to.deep.equal([[1],[2]]);
    expect(watcher2.mock.calls).to.deep.equal(watcher1.mock.calls);
});

it('subscribers should initially receive the default value if there are no synchronous constructor signals', async () => {
    const observable = new Observable(subscriber => {
        // async constructor signal
        setTimeout(() => {
            subscriber.next(1);
        }, 0);
    });
    const store = readable(observable);
    const watcher1 = vi.fn();
    const watcher2 = vi.fn();

    store.subscribe(watcher1);
    store.subscribe(watcher2);

    // allow async calls to complete
    await new Promise(resolve => setTimeout(resolve, 1));

    expect(watcher1.mock.calls).to.deep.equal([[undefined],[1]]);
    expect(watcher2.mock.calls).to.deep.equal(watcher1.mock.calls);
});

