# @crikey/stores-base-queue

Internal peer package used to ensure signals emitted from stores are executed in a reliable predictable manner
even as stores and subscriptions are changed.

## API

### Queue functions

* {@link enqueue_store_signals} - add actions onto the queue

### Action running:

* {@link actionRunner} - Current (global) action runner
* {@link set_store_runner} - Set current (global) action runner
* {@link get_store_runner} - Get current (global) action runner

### Default action runners:

* {@link store_runner_hide_errors} - Swallow all error emitted by actions
* {@link store_runner_throw_errors} - Do not handle errors emitted by actions
* {@link create_store_runner_log_errors} - Create an action runner which logs errors emitted by actions 

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
{@codeblock ./examples/action-queue.test.ts#example}

_Example with nesting:_
{@codeblock ./examples/action-queue.test.ts#example-nested}

_Example Exception Handling:_
{@codeblock ./examples/action-queue.test.ts#example-log-errors}
