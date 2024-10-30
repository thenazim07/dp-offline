export function useHasUniquePropertyValuesOfObjects<T, K extends keyof T>(arr: T[], property: K): boolean {
    const seenValues = new Set<T[K]>();

    for (const obj of arr) {
        if (seenValues.has(obj[property].trim())) {
            return false; // Duplicate found
        }
        seenValues.add(obj[property].trim());
    }

    return true; // No duplicates found
}
