import { expect, it } from 'vitest'
import { create_pending } from '../src';

const checkLength = (length: number) => {
    const pending = create_pending(length);

    expect(pending.is_dirty()).to.be.false;

    for (const index of Array.from(Array(length).keys())) {
        pending.invalidate(index);
        expect(pending.is_dirty()).to.be.true;
    }

    for (const index of Array.from(Array(length).keys())) {
        pending.validate(index);

        if (index + 1 !== length)
            expect(pending.is_dirty()).to.be.equal(true, `${index} of ${length}`);
        else
            expect(pending.is_dirty()).to.be.false;
    }

    expect(pending.is_dirty()).to.be.false;

    // start
    pending.invalidate(0);
    if (length > 0)
        expect(pending.is_dirty()).to.be.true;
    pending.validate(0);
    expect(pending.is_dirty()).to.be.false;

    // mid point
    if (length >> 2 < length) {
        pending.invalidate(length >> 2);
        expect(pending.is_dirty()).to.be.true;
        pending.validate(length >> 2);
        expect(pending.is_dirty()).to.be.false;
    }

    // end
    if (length - 1 >= 0) {
        pending.invalidate(length - 1);
        expect(pending.is_dirty()).to.be.true;
        pending.validate(length - 1);
        expect(pending.is_dirty()).to.be.false;
    }
}

it('should work for 0 entries', () => {
    checkLength(0);
});

it('should work for 1 entry', () => {
    checkLength(1);
})

it('should work for [2..32] entries', () => {
    for (const length of Array.from(Array(32 + 1).keys()).slice(2))
        checkLength(length);
})

it('should work for [33..1024] entries', () => {
    checkLength(33);
    checkLength(528);
    checkLength(1024);
});

it('should work for 1025 or more entries', () => {
    checkLength(1025);
    checkLength(10000);
});
