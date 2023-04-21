/** Generic action. */
export type Action = () => void;

/** Wrapper used to call actions and handle any possible errors */
export type StoreRunner = (action: Action) => void;
