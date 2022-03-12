/**
 * Traverses root using the given path, deleting the final leaf node if it exists.
 * Note that type safety cannot be strictly enforced since path is dynamic.
 *
 * @param root the root node to start from
 * @param path array of members/elements
 */
export function traverse_delete<T>(
    root: T,
    path: readonly PropertyKey[]
): T {
    if (path.length === 0)
        return <T><any>undefined;

    let parent: any = undefined;
    let node: any = root;
    let segment: PropertyKey;
    for (segment of path) {
        if (!node || typeof node !== 'object')
            return root;

        if (Array.isArray(node) && typeof segment !== 'number')
            return root;

        if (!({}).hasOwnProperty.call(node, segment))
            return root;

        parent = node;
        node = node[segment];
    }

    delete parent[segment!];

    return root;
}

