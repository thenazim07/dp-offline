type ObjectWithProperty = { [key: string]: any };

// Composable function that removes objects from the array where the given property is empty
export function useRemoveObjectWithEmptyProperty<T extends ObjectWithProperty>(array: T[], property: keyof T): T[] {
    return array.filter((obj) => {
        const value = obj[property].trim();
        return value !== undefined && value !== null && value !== '';
    });
}
