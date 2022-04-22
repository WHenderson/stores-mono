import {expect, vi, it} from 'vitest'
import {BehaviorSubject, Observable} from "rxjs";
import {readable_persist} from "../src";

it('synchronous constructor signals should be collapsed', () => {
    const observable = new Observable(subscriber => {
        // constructor signals
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
    });
    const store = readable_persist(observable);
    const watcher1 = vi.fn();

    store.subscribe(watcher1);

    expect(watcher1.mock.calls).to.deep.equal([[3]]);
});

it('subscribers should initially receive the default value if there are no synchronous constructor signals', async () => {
    const observable = new Observable(subscriber => {
        // async constructor signal
        setTimeout(() => {
            subscriber.next(1);
        }, 0);
    });
    const store = readable_persist(observable);
    const watcher1 = vi.fn();
    const watcher2 = vi.fn();

    store.subscribe(watcher1);
    store.subscribe(watcher2);

    // allow async calls to complete
    await new Promise(resolve => setTimeout(resolve, 1));

    expect(watcher1.mock.calls).to.deep.equal([[undefined],[1]]);
    expect(watcher2.mock.calls).to.deep.equal(watcher1.mock.calls);
});

it('constructor signals should not be re-issued', async () => {
    let n = 0;
    const observable = new Observable(subscriber => {
        subscriber.next(++n);
        subscriber.next(++n);
        // async constructor signal
        setTimeout(() => {
            subscriber.next(++n);
        }, 0);
    });
    const store = readable_persist(observable);
    const watcher1 = vi.fn();
    const watcher2 = vi.fn();

    store.subscribe(watcher1);

    // allow async calls to complete
    await new Promise(resolve => setTimeout(resolve, 1));

    store.subscribe(watcher2);

    expect(watcher1.mock.calls).to.deep.equal([[2],[3]]);
    expect(watcher2.mock.calls).to.deep.equal([[3]]);
});

it('should be able to unlink and link from the observable', () => {
    // note that a BehaviorSubject behaves much like a svelte store
    // i.e. subscribers are immediately called with the current value
    const observable = new BehaviorSubject<number>(0);
    const store = readable_persist(observable, -1);
    const watcher = vi.fn();

    store.subscribe(watcher);
    expect(watcher.mock.calls).to.deep.equal([[0]]);

    observable.next(1);
    expect(watcher.mock.calls).to.deep.equal([[0], [1]]);

    store.unlink();

    observable.next(2);
    expect(watcher.mock.calls).to.deep.equal([[0], [1]]);

    store.link();

    observable.next(3);
    expect(watcher.mock.calls).to.deep.equal([[0], [1], [2], [3]]);
})

