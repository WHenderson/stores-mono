export interface ReadSelector<I,O> {
    /**
     * Used for reading a child value from a parent
     *
     * @param parent the parent value
     * @return the child value
     */
    get: (parent: I) => O;
}

export interface WriteSelector<I,O> {
    /**
     * Used for updating the child value of a parent
     *
     * @param parent the parent value
     * @param value the updated child value
     * @return a new parent value containing the updated child value
     */
    update: (parent: I, value: O) => I;
}

export interface DeleteSelector<I> {
    /**
     * Used for deleting the child of a parent
     *
     * @param parent the parent value
     * @return a new parent value with the child deleted
     */
    delete: (parent: I) => I;
}

export type Delete = (this: void) => void;
export interface Deletable {
    delete: Delete;
}
