import {expect, it} from 'vitest'
import {sym_path, create_path_proxy} from "../src";

it('should return whatever path is accessed', () => {
    const sym = Symbol('test symbol');
    expect(create_path_proxy(['start']).a.b.c[0][1.1][sym][sym_path]).to.deep.equal(['start','a','b','c',0,'1.1',sym]);
})
