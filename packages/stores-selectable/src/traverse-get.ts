/**
 * Traverses root using the given path, returning the final leaf node.
 *
 * @returns any the final leaf node, or undefined if it is inaccessible/does not exist
 * @param root the root node to start from
 * @param path array of members/elements
 */
export function traverse_get<T>(
    root: T,
    path: readonly PropertyKey[]
): any {
    let node: any = root;
    for (const segment of path) {
        if (node === undefined)
            return undefined;

        // primitive type or mismatched array[number]
        if (typeof node !== 'object' || node === null)
            return undefined;

        // array types can only have numbered elements
        if (Array.isArray(node) && typeof segment !== 'number')
            return undefined;

        node = node[segment];
    }

    return node;
}
