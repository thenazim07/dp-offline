export default function checkPreviousItem(data: any, key: string) {
    return data?.value.findIndex((item: any) => item.uuid === key);
}
