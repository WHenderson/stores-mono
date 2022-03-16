/**
 * Contract for a Pending state tracker
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
    pending(this: void): boolean;
}

/**
 * Create an efficient system for determining if any of an array of items are pending
 * @param length maximum number of pending items to keep track of
 */
export function create_pending(length: number) : Pending {
    if (length === 0) {
        // 0 items. never pending.

        return {
            validate(_index: number): void {
            },
            invalidate(_index: number): void {
            },
            pending(): boolean {
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
            pending(): boolean {
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
            pending(): boolean {
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
            pending(): boolean {
                return !!count;
            }
        }
    }
}
