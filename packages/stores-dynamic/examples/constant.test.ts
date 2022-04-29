import {expect, it} from "vitest";
import {get} from '@crikey/stores-base';
import {constant, constant_error, constant_value} from "../src";
import {shim_console} from "./_util";

it('example-constant', () => {
    const console = shim_console();

    // #region example-constant
    const store = constant({ value: 10 });

    console.log('store value:', get(store));

    // > store value: undefined
    // #endregion example-constant

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', { value: 10, is_const: true }],
    ]);
});

it('example-constant-value', () => {
    const console = shim_console();

    // #region example-constant-value
    const store = constant_value(10);

    console.log('store value:', get(store));

    // > store value: undefined
    // #endregion example-constant-value

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', { value: 10, is_const: true }],
    ]);
});

it('example-constant-error', () => {
    const console = shim_console();

    // #region example-constant-error
    const error = new Error('my error');
    const store = constant_error(error);

    console.log('store value:', get(store));

    // > store value: undefined
    // #endregion example-constant-error

    expect(console.log.mock.calls).to.deep.equal([
        ['store value:', { error, is_const: true }],
    ]);
});
