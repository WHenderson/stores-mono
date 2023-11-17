import {expect, it} from "vitest";
import {by_chain, by_property, by_property_get} from "../src";

it('should chain selectors', function () {
    interface Obj {
        parent: {
            a: number,
            b?: number
        },
    }
    const original : Obj = { parent: { a: 1 } };

    const selector_parent = by_chain<Obj, Obj['parent']>(by_property('parent'));

    expect(selector_parent.get(original)).toBe(original.parent);
    expect(selector_parent.update(original, { a: 2 })).to.deep.equal({ parent: { a: 2 } });
    expect(selector_parent.update(original, original.parent)).toBe(original);


    const selector_a = by_chain<Obj, Obj['parent'], Obj['parent']['a']>(by_property('parent'), by_property('a'));

    expect(selector_a.get(original)).toBe(1);
    expect(selector_a.update(original, 2)).to.deep.equal({ parent: { a: 2 } });
    expect(selector_a.update(original, 1)).toBe(original);

    const selector_b = by_chain<Obj, Obj['parent'], Obj['parent']['b']>(by_property('parent'), by_property('b'));

    expect(() => selector_b.get(original)).toThrow('property not found');
    expect(selector_b.update(original, 2)).to.deep.equal({ parent: { a: 1, b:2 } });
    expect(selector_b.delete(selector_b.update(original, 2))).to.deep.equal({ parent: { a: 1 } });
    expect(selector_b.delete(original)).toBe(original);

    const selector_b_get = by_chain<Obj, Obj['parent'], Obj['parent']['b']>(by_property('parent'), by_property_get('b'));

    expect(selector_b_get).not.toHaveProperty('update');
    expect(selector_b_get).not.toHaveProperty('delete');

    expect(original, 'original should not be mutated').to.deep.equal({ parent: { a: 1 } });
});
