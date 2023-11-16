type MappedC<A, B> = {
    [K in keyof A & keyof B]:
    A[K] extends B[K]
        ? never
        : K
};

export type OptionalKeys<T> = MappedC<T, Required<T>>[keyof T];
