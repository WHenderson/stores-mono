/** Callback to inform of a value updates. */
export type Subscriber<T> = (value: T) => void;

import { Action } from '@crikey/stores-base-queue';
export { Action } from '@crikey/stores-base-queue';

/** Unsubscribes from value updates. */
export type Unsubscriber = Action;

/** Callback to update a value. */
export type Updater<T> = (value: T) => T;

/** Callback to inform that a value is undergoing change. Helps solve the diamond dependency problem */
export type Invalidator = Action;

/** Callback to inform that the value was reevaluated to the same value */
export type Revalidator = Action;

/** Callback to inform that the last subscriber has unsubscribed */
export type StopNotifier = Action;

/** Callback to inform that there is now a subscriber */
export type StartNotifier<T> = (set: Subscriber<T>, invalidate: Invalidator, revalidate: Revalidator) => StopNotifier | void;

/** Callback used to determine if a change signal should be emitted */
export type Trigger<T> = (initial: boolean, new_value: T, old_value?: T) => boolean;

/** Basic subscription signature used by terminal subscriptions */
export type SubscribeBasic<T> = (this: void, run: Subscriber<T>) => Unsubscriber;

/** Full subscription signature used derived store types */
export type SubscribeFull<T> = (this: void, run: Subscriber<T>, invalidate?: Invalidator, revalidate?: Revalidator) => Unsubscriber;

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
    /**
     * Set value and inform subscribers.
     *
     * @param value to set
     */
    set(this: void, value: T): void;

    /**
     * Update value using callback and inform subscribers.
     *
     * @param updater callback
     */
    update(this: void, updater: Updater<T>): void;
}
