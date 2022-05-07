/** Callback to inform of a value updates. */
export type Subscriber<T> = (value: T) => void;

/** Generic action. */
export type Action = () => void;

/** Unsubscribes from value updates. */
export type Unsubscriber = Action;

/** Callback to update a value. */
export type UpdaterSync<T> = (value: T) => T;

/** Callback to update a value. */
export type UpdaterAsync<T> = (value: T, set: Set<T>) => void;

/** Callback to inform that a value is undergoing change. Helps solve the diamond dependency problem */
export type Invalidate = Action;

/** Callback to inform that the value was reevaluated to the same value */
export type Revalidate = Action;

/** Callback to inform that the last subscriber has unsubscribed */
export type StopNotifier = Action;

/** Signature of the {@link Writable.set} function */
export type Set<T> = (this: void, value: T) => void;

/** Signature of the {@link Writable.update} function */
export type Update<T> = (this: void, updater: UpdaterAsync<T> | UpdaterSync<T>) => void;

export type ComplexSet<T> =
    Set<T> &
    {
        set: Set<T>,
        update: Update<T>,
        invalidate: Invalidate,
        revalidate: Revalidate
    };

/** Callback to inform that there is now a subscriber */
export type StartNotifier<T> = (set: ComplexSet<T>) => StopNotifier | void;

/** Callback used to determine if a change signal should be emitted */
export type Trigger<T> = (initial: boolean, new_value: T, old_value?: T) => boolean;

/** Basic subscription signature used by terminal subscriptions */
export type SubscribeBasic<T> = (this: void, run: Subscriber<T>) => Unsubscriber;

/** Full subscription signature used by derived store types */
export type SubscribeFull<T> = (this: void, run: Subscriber<T>, invalidate?: Invalidate, revalidate?: Revalidate) => Unsubscriber;

/** Subscription signature */
export type Subscribe<T> = SubscribeBasic<T> | SubscribeFull<T>;

/**
 * Readable interface for subscribing.
 *
 * @category Core
 */
export interface Readable<T> {
    /**
     * Subscribe on value changes.
     *
     * @param run subscription callback - calls are queued
     * @param invalidate cleanup callback - calls are immediate
     */
    subscribe: Subscribe<T>;
}

/**
 * Writable interface for both updating and subscribing.
 *
 * @category Core
 */
export interface Writable<T> extends Readable<T> {
    /** Set value and inform subscribers. */
    set: Set<T>;

    /** Update value using callback and inform subscribers. */
    update: Update<T>;
}
