import {expect, it} from 'vitest'
import {resolve_selector} from "../src";

it('should return whatever path is accessed', () => {
    const sym = Symbol('test symbol');
    expect(resolve_selector((x: any) => x.a.b.c[0][1.1][sym])).to.deep.equal(['a','b','c',0,'1.1',sym]);
});
