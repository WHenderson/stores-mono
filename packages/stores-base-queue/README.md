# @crikey/stores-base-queue

Internal peer package used to solve the diamond dependency problem.

## Table of Contents

1. [Reasoning](#Reasoning)
   1. [The Diamond Dependency Problem](#The-Diamond-Dependency-Problem)
   2. [Why a peer dependency?](#Why-a-peer-dependency)

## Reasoning

### The Diamond Dependency Problem

Imagine you have a derived store (`D`) with multiple inputs (`B` and `C`) who are themselves dependent on a shared input (`A`):

```js
const A = writable(1);
A.subscribe(A => console.log(`A is ${A}`));

const B = derived(A, (A => A*10));
B.subscribe(B => console.log(`B is ${B}`));

const C = derived(A, (A => A*100));
C.subscribe(C => console.log(`C is ${C}`));

const D = derived([B,C], (B,C) => B + C);
D.subscribe(D => console.log(`D is ${D}`));

// > A is 1
// > B is 10
// > C is 100
// > D is 110
```

```mermaid
graph TD
    A --> B & C--> D
```

Now imagine we wish to update `A`.
```js
A.set(2);
```

With a simplistic subscriber pattern, each subscriber will be called immediately upon change, 
resulting in the following:

```js
// > A is 2
// > B is 20
// > D is 120
// > C is 200
// > D is 220
```

Note that D is updated twice. The first time with a mix of updated and cached inputs which results in an invalid value.  

To avoid this erroneous update, the `store.subscribe` function is extended to accept an optional `invalidate` callback.
```ts
export type SubscribeFull<T> = (this: void, run: Subscriber<T>, invalidate?: Invalidator) => Unsubscriber;
```
When a store value is changed, all registered `invalidate` callbacks are called synchronously and all `run` callbacks
are queued. Each item added to the `run` queue is called in FIFO order with execution beginning as soon as the first 
item is queued.

During execution, derived stores keep track of the validity of each input using `run` and `invalidate` callbacks. Only 
once all inputs are considered valid will the derived store run its calculation and derive a new value.

Thus, updating `A` will result in `D` updating only once:
```js
// > A is 2
// > B is 20
// > C is 200
// > D is 220
```

### Why a peer dependency?
The solution to the _Diamond Dependency Problem_ requires a _shared_ queue. By including this package as a 
peer dependency, only one queue will be created.
