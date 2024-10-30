/**
 * Creates a shallow copy of the input object.
 * @param item - The object to be copied.
 * @returns A shallow copy of the input object.
 */
export default function copyObject<T extends object>(item: T): T {
    return Object.fromEntries(Object.entries(item)) as T;
}
