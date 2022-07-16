import {readable} from "@crikey/stores-strict";
import {writable} from "@crikey/stores-strict";
import {Readable, Writable} from "@crikey/stores-base";
import {is_selectable, selectable} from "../src";
import {expect, it} from "vitest";

it('should correctly identify selectables', () => {
    const ro: Readable<number> = readable(0);
    const rw: Writable<number> = writable(0);
    const ros: Readable<number> = selectable(ro);
    const rws: Writable<number> = selectable(rw);

    expect(is_selectable(ro)).to.be.false;
    expect(is_selectable(rw)).to.be.false;
    expect(is_selectable(ros)).to.be.true;
    expect(is_selectable(rws)).to.be.true;
});
