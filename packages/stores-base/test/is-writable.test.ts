import {expect, it} from "vitest";
import {is_writable, readable, trigger_always, writable} from "../src";

it('should differentiate between readable and writable stores', () => {
    const ro = readable(trigger_always, 1);
    const rw = writable(trigger_always, 1);

    expect(is_writable(ro)).toBeFalsy();
    expect(is_writable(rw)).toBeTruthy();
    expect(is_writable({ subscribe: rw.subscribe })).toBeFalsy();
    expect(is_writable(Object.assign({}, ro, { set: rw.set }))).toBeFalsy();
    expect(is_writable(Object.assign({}, ro, { update: rw.update }))).toBeFalsy();
    expect(is_writable(Object.assign({}, ro, { set: rw.set, update: rw.update }))).toBeTruthy();
});
