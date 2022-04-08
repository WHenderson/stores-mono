/**
 * Traverses root using the given path, adding nodes as necessary, replacing the final leaf node using the provided
 * callback.
 * When adding nodes, the type of node to be added is determined by the subsequent path segment - array for numbers
 * and objects for strings/symbols.
 * When accessing an array element, the array is padded with undefined elements to avoid sparse arrays.
 * Note that type safety cannot be strictly enforced since path is dynamic.
 *
 * @throws TypeError if an attempt is made to access a member/element of a primitive type
 * @throws TypeError if an attempt is made to access an array using something other than a number segment
 * @returns any the (possibly updated) root node
 * @param root the root node to start from
 * @param path array of members/elements
 * @param update callback used to replace the leaf node value
 */
export function traverse_update<T,U>(
    root: T,
    path: readonly PropertyKey[],
    update: (old_value: unknown) => U // returns new value
): T {
    if (path.length === 0)
        return <T><unknown>update(root);

    if (root === undefined) {
        const segment = path[0];

        root = (typeof segment === 'number')
            ? <any>[]
            : <any>{};
    }

    let parent: any;
    let node: any = root;
    let segment: PropertyKey;

    const len = path.length;
    for (let i = 0; i !== len; ++i) {
        // move on
        parent = node;

        // primitive type or mismatched array[number]
        if (typeof parent !== 'object' || parent === null)
            throw new TypeError('cannot index simple types');

        segment = path[i];

        // array types can only have numbered elements
        if (Array.isArray(parent) && typeof segment !== 'number')
            throw new TypeError('arrays must be indexed by number');

        // avoid sparse arrays
        if (Array.isArray(parent) && typeof segment === 'number' && segment > parent.length)
            parent.push.apply(parent, Array(segment - parent.length));

        // only select own properties
        node = (({}).hasOwnProperty.call(parent, segment))
            ? parent[segment]
            : undefined;

        // create members/elements if we can deduce the correct type
        if (node === undefined && i + 1 !== len) {
            const nextSegment = path[i + 1];
            node = typeof nextSegment === 'number'
                ? []
                : {};

            parent[segment] = node;
        }
    }

    parent[segment!] = update(node);
    return root;
}

