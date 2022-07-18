import {expect, it, vi} from "vitest";
import {constant, subscribe} from "../src";

it('should subscribe to resolved values', () => {
    const inner = { value: 1 };

    (() => {
        const watch_run = vi.fn();
        const watch_invalidate = vi.fn();
        const watch_revalidate = vi.fn();

        const unsub = subscribe(inner, watch_run, watch_invalidate, watch_revalidate);
        expect(watch_run).toHaveBeenCalledOnce();
        expect(watch_run).toHaveBeenCalledWith(inner);
        expect(watch_invalidate).not.toHaveBeenCalled();
        expect(watch_revalidate).not.toHaveBeenCalled();
        unsub();
    })();

    (() => {
        const watch_run = vi.fn();
        const watch_invalidate = vi.fn();
        const watch_revalidate = vi.fn();

        const store = constant(inner);

        const unsub = subscribe(store, watch_run, watch_invalidate, watch_revalidate);
        expect(watch_run).toHaveBeenCalledOnce();
        expect(watch_run).toHaveBeenCalledWith(Object.assign({ is_const: true }, inner));
        expect(watch_invalidate).not.toHaveBeenCalled();
        expect(watch_revalidate).not.toHaveBeenCalled();
        unsub();
    })();
});
