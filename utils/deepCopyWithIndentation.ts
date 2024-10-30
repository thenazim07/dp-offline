export function deepCopyWithIndentation<T>(obj: T, spaces: number = 2): T {
    return JSON.parse(JSON.stringify(obj, null, spaces));
}
