export enum State {
    Pending = 0,
    Fulfilled = 1,
    Rejected = -1
}

export interface StatefulPending<T> {
    readonly isPending: true;
    readonly isFulfilled: false;
    readonly isRejected: false;
    readonly state: State.Pending;
    readonly value?: T;
}

export interface StatefulFulfilled<T> {
    readonly isPending: false;
    readonly isFulfilled: true;
    readonly isRejected: false;
    readonly state: State.Fulfilled;
    readonly value: T;
}

export interface StatefulRejected {
    readonly isPending: false;
    readonly isFulfilled: false;
    readonly isRejected: true;
    readonly state: State.Rejected;
    readonly error: any;
}

export type Stateful<T> = StatefulPending<T> | StatefulFulfilled<T> | StatefulRejected;
