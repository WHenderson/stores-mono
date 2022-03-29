import {fn, SpyInstanceFn} from 'vitest';

export interface Console {
    log: SpyInstanceFn<Parameters<typeof console.log>, ReturnType<typeof console.log>>;
    error: SpyInstanceFn<Parameters<typeof console.error>, ReturnType<typeof console.error>>;
}

export function create_console(): Console {
    return {
        log: fn(),
        error: fn()
    }
}
