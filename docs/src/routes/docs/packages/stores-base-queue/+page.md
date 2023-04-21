# stores-base-queue

This package is a peer dependency for managing store signals. It ensures that signals are executed in a reliable and predictable manner even as stores and subscriptions are updated or errors are thrown.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-base-queue)](https://codecov.io/gh/WHenderson/stores-mono)

## Installation

```bash
# pnpm
$ pnpm add --save-peer @crikey/stores-base-queue

# npm
$ npm add --save-peer @crikey/stores-base-queue

# yarn
$ yarn add --peer @crikey/stores-base-queue
```

:::admonition type="note"
It is important that this package be installed as a peer dependency to ensure that 
a common global queue is shared between packages
:::

## API

## Queue functions

### `enqueue_store_signals`

```ts
type Action = () => void;

enqueue_store_signals(actions: Action[]): void
```

Add actions to the end of the global action FIFO queue.

If the queue is empty, the actions are placed on the queue and begin executing immediately.
Execution continues until the queue is exhausted, including any actions added during this process.
Only once the queue is empty does the function return.

If the queue is not empty, the actions are added to the queue and the function returns immediately.

## Action running

### `store_runner`

```ts
type StoreRunner = (action: Action) => void;

store_runner : StoreRunner
```

Current (global) action runner.

When processing store signals, each action is executed via the `store_runner`.   

### `set_store_runner`

```ts
set_store_runner(runner: StoreRunner): StoreRunner
```` 

Set current (global) action runner `store_runner` and return the former runner.

### `get_store_runner`
```ts
get_store_runner(): StoreRunner
``` 
Get current (global) action runner

## Default action runners

### `store_runner_hide_errors`
```ts
store_runner_hide_errors(action: Action): void
```

A store runner which discards any errors emitted by action

### `store_runner_throw_errors`
```ts
store_runner_throw_errors(action: Action): void
```

A store running which does not handle exceptions


### `create_store_runner_log_errors`

```ts
type Logger = (error: any) => void;

create_store_runner_log_errors(logger: Logger = console.error): StoreRunner
```

Creates a store running which logs any exceptions using the provided logger


