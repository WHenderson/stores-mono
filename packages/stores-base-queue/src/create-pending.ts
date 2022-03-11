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
    else
    if (length <= 1024) {
        // max 1024 items. divide items into groups and use bitmasks for each group.
        // use an overall bitmask to track the entire collection.

        let combined = 0;
        const grouped: number[] = Array((length >> 5) + 1).fill(0);
        return {
            validate(index: number): void {
                grouped[index >> 5] &= ~(1 << (index & 0x1f));
                combined &= ~((grouped[index >> 5] ? 0 : 1) << (index >> 5));
            },
            invalidate(index: number): void{
                grouped[index >> 5] |= (1 << (index & 0x1f));
                combined |= (1 << (index >> 5));
            },
            pending(): boolean {
                return !!combined;
            }
        }
    }
    else {
        // unlimited items. divide items into groups and use bitmasks for each group.

        const grouped: number[] = Array((length >> 5) + 1).fill(0);
        let definitely_pending = false;
        return {
            validate(index: number): void {
                grouped[index >> 5] &= ~(1 << (index & 0x1f));
                definitely_pending = !!grouped[index >> 5];
            },
            invalidate(index: number): void{
                grouped[index >> 5] |= (1 << (index & 0x1f));
                definitely_pending = true;
            },
            pending(): boolean {
                if (definitely_pending)
                    return true;
                return definitely_pending = grouped.some(
                    _ => !!_
                );
            }
        }
    }
}
