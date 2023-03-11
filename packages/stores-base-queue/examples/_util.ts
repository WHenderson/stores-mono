import {SpyInstance, vi} from 'vitest';

export interface Console {
    log: SpyInstance<Parameters<typeof console.log>, ReturnType<typeof console.log>> & typeof console.log;
    error: SpyInstance<Parameters<typeof console.error>, ReturnType<typeof console.error>> & typeof console.error;
    debug: typeof console.debug;
}

export function shim_console(): Console {
    return {
        log: vi.fn(),
        error: vi.fn(),
        debug: console.debug
    }
}
