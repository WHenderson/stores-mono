export function shim_setTimeout() {
    return (callback: Function, ms?: number) => setTimeout(callback, (ms ?? 0) / 1000);
}

export function shim_setInterval() {
    return (callback: Function, ms?: number) => setInterval(callback, (ms ?? 0) / 1000);
}
