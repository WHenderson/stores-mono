import {fn, SpyInstanceFn} from "vitest";

export function shim_setTimeout() {
    return (callback: Function, ms?: number): number  => setTimeout(callback, (ms ?? 0) / 10);
}

export function shim_setInterval() {
    return (callback: Function, ms?: number): number  => setInterval(callback, (ms ?? 0) / 10);
}

export interface Console {
    log: SpyInstanceFn<Parameters<typeof console.log>, ReturnType<typeof console.log>>;
    error: SpyInstanceFn<Parameters<typeof console.error>, ReturnType<typeof console.error>>;
    debug: typeof console.debug;
}

export function shim_console(): Console {
    return {
        log: fn(),
        error: fn(),
        debug: console.debug
    }
}
