export function checkForDuplicate(items: any, newItem: any, key: string, message: string = ''): boolean {
    if (!items || !items[key]) return true;

    const isDuplicate = items[key].some((item: any) => item.uuid === newItem.uuid);

    if (isDuplicate) {
        const toast = useToast();
        toast.add({ title: message, color: 'red' });
    }

    return isDuplicate;
}
