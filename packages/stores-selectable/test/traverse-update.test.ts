import {expect, it} from 'vitest'
import {traverse_update} from "../src";

it('should update root node', () => {
    expect(traverse_update(<any>undefined, [], _ => 'x')).toBe('x');

    expect(traverse_update(<any>undefined, [2], _ => 'x')).to.deep.equal([undefined, undefined, 'x']);

    expect(traverse_update(<any>undefined, ['a'], _ => 'x')).to.deep.equal({ a: 'x' });
});

it('should create entire path', () => {
    expect(traverse_update(<any>{}, ['a',2,'b',3], _ => 'x')).to.deep.equal({
        a: [
            undefined,
            undefined,
            {
                b: [
                    undefined,
                    undefined,
                    undefined,
                    'x'
                ]
            }
        ]
    });
});

it('should update the existing value', () => {
    expect(traverse_update(<any>{ a: 1 }, ['a'], old_value => <number>old_value + 1)).to.deep.equal({ a: 2 });
    expect(traverse_update(<any>[1], [0], old_value => <number>old_value + 1)).to.deep.equal([2]);
});

