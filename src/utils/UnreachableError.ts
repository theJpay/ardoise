export class UnreachableError extends Error {
    constructor(value: never) {
        super(`Unreachable case: ${value}`);
    }
}
