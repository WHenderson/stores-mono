# @crikey/stores-base-queue

Internal peer package used to ensure signals emitted from stores are executed in a reliable predictable manner 
even as stores and subscriptions are changed.

See [@crikey/stores-base-queue](https://whenderson.github.io/stores-mono/modules/_crikey_stores_base_queue.html) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-base-queue)](https://codecov.io/gh/WHenderson/stores-mono)

## API

### Queue functions

* `enqueue_store_signals` - add actions onto the queue

### Action running:

* `store_runner` - Current (global) action runner
* `set_store_runner` - Set current (global) action runner
* `get_store_runner` - Get current (global) action runner

### Default action runners:

* `store_runner_hide_errors` - Swallow all error emitted by actions
* `store_runner_throw_errors` - Do not handle errors emitted by actions
* `create_store_runner_log_errors` - Create an action runner which logs errors emitted by actions

## Installation

**Note: It is important that this package be installed as a peer dependency to ensure the queue is shared between 
store implementations**

```bash
# pnpm
$ pnpm add --save-peer @crikey/stores-base-queue

# npm
$ npm add --save-peer @crikey/stores-base-queue

# yarn
$ yarn add --peer @crikey/stores-base-queue
```

## Usage

Enqueue the provided actions using a FIFO queue.
If the queue is empty, the actions will begin being called immediately until the queue is exhausted.
Further actions may be added during execution which will be executed once the preceding actions are exhausted.

_Example:_
```ts
const action_a = () => { console.log('action a') };
const action_b = () => { console.log('action b') };

enqueue_store_signals([
    action_a,
    action_b
]);

// > action a
// > action b
```

_Example with nesting:_
```ts
enqueue_store_signals([
    () => { console.log("action 1") },
    () => {
        console.log("action 2");
        enqueue_store_signals([
            () => { console.log("action 5") },
            () => { console.log("action 6") }
        ]);
        console.log("action 3");
    },
    () => { console.log("action 4") },
]);

// > action 1
// > action 2
// > action 3
// > action 4
// > action 5
// > action 6
```

_Example Exception Handling:_
```ts
const original_runner = set_store_runner(create_store_runner_log_errors(console.error));
try {
    enqueue_store_signals([
        () => {
            throw new Error('error 1');
        },
        () => {
            throw new Error('error 2');
        },
        () => {
            throw new Error('error 3');
        }
    ]);

    console.log('done.');

    // > Error: error 1
    // > Error: error 2
    // > Error: error 3
    // > done.
} finally {
    set_store_runner(original_runner);
}
```
