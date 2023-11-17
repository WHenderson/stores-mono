import {expect, it} from "vitest";
import {shim_console} from "@crikey/stores-base/examples/_util";
import {get, writable} from "@crikey/stores-strict";
import {by_key, by_property, by_size, select} from "../src";

it('example-select', function () {
    const console = shim_console();

    // example state store
    const state = writable({
        user: {
            id: 5,
            username: 'Joe Blogs'
        },
        accounts: new Map([
            [2, { id: 2, name: 'First National' }],
            [3, { id: 3, name: 'Bank of mum and dad'}]
        ])
    });

    // Create nested derived stores to access user information
    const user = select(state, by_property('user'));
    const user_id = select(user, by_property('id'));
    const user_username = select(user, by_property('username'));
    console.log(get(user_id)); // 5
    console.log(get(user_username)); // Joe Blogs

    // These are stores, so everything is reactive
    user_username.set('Joe Middlename Blogs');
    console.log(get(user)); // { id: 5, username: 'Joe Middlename Blogs' }

    // Create derived account stores
    const accounts = select(state, by_property('accounts'));
    const n_accounts = select(accounts, by_size());
    console.log(get(n_accounts)); // 2

    // Selectors can be chained to access deeply nested values
    const first_national = select(state, by_property('accounts'), by_key(2));
    console.log(get(first_national)); // { id: 2, name: 'First National' }

    expect(console.log.mock.calls).to.deep.equal([
        [5],
        ['Joe Blogs'],
        [{ id: 5, username: 'Joe Middlename Blogs'}],
        [2],
        [{ id: 2, name: 'First National' }]
    ]);
});
