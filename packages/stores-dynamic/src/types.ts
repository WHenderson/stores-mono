import {Readable} from "@crikey/stores-base";

export type DynamicDependents = ReadonlySet<DynamicReadable<any>>;

export type DynamicDependencies = { dependencies: DynamicDependents | undefined };

/** Flag Dynamic value to determine if deriving calculation is static */
export type DynamicFlagConstant = { is_const: boolean };

/** Hold an error thrown during the evaluation of a dynamic item */
export type DynamicError = { error: any } & Partial<DynamicDependencies> & Partial<DynamicFlagConstant>;

/** Hold the resolved value of a dynamic item */
export type DynamicValue<T> = { value: T } & Partial<DynamicDependencies> & Partial<DynamicFlagConstant>;

/** Hold the resolved value or error of a dynamic item */
export type DynamicResolved<T> = DynamicError | DynamicValue<T>;

/** A store containing a dynamic result */
export type DynamicReadable<T> = Readable<DynamicResolved<T>>;

/** Any kind of dynamic item */
export type Dynamic<T> = DynamicResolved<T> | DynamicReadable<T>;
