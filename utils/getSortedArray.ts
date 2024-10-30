export default function getSortedArray(dataArray: any): any {
    return dataArray?.value?.data ? dataArray.value.data.sort((a, b) => b.weight - a.weight) : [];
}
