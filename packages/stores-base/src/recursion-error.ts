export class RecursionError extends Error {
    constructor(message = RecursionError.name) {
        super(message);
    }
}

Object.defineProperty(RecursionError.prototype, 'name', {
    enumerable: false,
    configurable: true,
    value: RecursionError.name,
    writable: true
});
