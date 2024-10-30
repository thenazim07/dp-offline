export default function findMatchingIndices(arr1, arr2) {
    return arr2.reduce((indices, item2) => {
        const index = arr1.findIndex((item1) => getUuid(item1.name) === item2);
        if (index !== -1) indices.push(index);
        return indices;
    }, []);
}
