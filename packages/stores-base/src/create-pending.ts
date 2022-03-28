/**
 * Contract for a Pending state tracker
 *
 * @category Pending
 */
export interface Pending {
    /**
     * signal that a specific item is now valid
     * @param index the valid item number
     */
    validate(this: void, index: number): void;

    /**
     * signal that a specific item is no longer valid
     * @param index the invalid item number
     */
    invalidate(this: void, index: number): void;

    /**
     * return true iff any items are in the invalid state
     */
    is_dirty(this: void): boolean;
}

/**
 * Create an efficient system for determining if any of an array of items are pending.
 *
 * Used by derived store types to ensure that the derived value is only recalculated once all dependent stores are in
 * a clean state.
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/pending.test.ts#example-pending}
 *
 * @category Pending
 * @param length maximum number of pending items to keep track of
 * @returns a pending state tracker which is currently clean
 */
export function create_pending(length: number) : Pending {
    if (length === 0) {
        // 0 items. never pending.

        return {
            validate(_index: number): void {
            },
            invalidate(_index: number): void {
            },
            is_dirty(): boolean {
                return false;
            }
        }
    }
    else
    if (length === 1) {
        // 1 item. simple flag.

        let pending = false;
        return {
            validate(_index: number): void {
                pending = false;
            },
            invalidate(_index: number): void {
                pending = true;
            },
            is_dirty(): boolean {
                return pending;
            }
        }
    }
    else
    if (length <= 32) {
        // max 32 items. use simple bit mask logic.

        let pending = 0;
        return {
            validate(index: number): void {
                pending &= ~(1 << index);
            },
            invalidate(index: number): void{
                pending |= (1 << index);
            },
            is_dirty(): boolean {
                return !!pending;
            }
        }
    }
    else {
        // array of pending bitmaps used to track the number of pending items

        let count = 0;
        let pending = Array.from(Array(length >> 5), () => 0);
        return {
            validate(index: number): void {
                if (pending[index >> 5] & (1 << (index & 0x1F))) {
                    --count;
                    pending[index >> 5] &= ~(1 << (index & 0x1F));
                }
            },
            invalidate(index: number): void {
                if (!(pending[index >> 5] & (1 << (index & 0x1F)))) {
                    ++count;
                    pending[index >> 5] |= (1 << (index & 0x1F));
                }
            },
            is_dirty(): boolean {
                return !!count;
            }
        }
    }
}
