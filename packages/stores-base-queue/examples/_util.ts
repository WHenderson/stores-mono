import {vi, SpyInstanceFn} from "vitest";

export interface Console {
    log: SpyInstanceFn<Parameters<typeof console.log>, ReturnType<typeof console.log>>;
    error: SpyInstanceFn<Parameters<typeof console.error>, ReturnType<typeof console.error>>;
    debug: typeof console.debug;
}

export function shim_console(): Console {
    return {
        log: vi.fn(),
        error: vi.fn(),
        debug: console.debug
    }
}
