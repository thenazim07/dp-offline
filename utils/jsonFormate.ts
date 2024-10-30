export default function jsonFormate(data: any = [], key = 'name') {
    return data.map((item: any) => {
        return {
            ...item,
            uuid: getUuid(item[key]),
        };
    });
}
