export default function (): string | undefined {
    const accessInfo = useCookie<any>('accessInfo');

    if (!accessInfo?.value?.token) return undefined;

    if (accessInfo.value && accessInfo.value.expires_at) {
        const currentDate = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss');
        const expiresDate = accessInfo.value.expires_at;
        if (currentDate.value > expiresDate) {
            accessInfo.value = {};
            return undefined;
        }
    }

    return `${accessInfo.value.auth_type} ${accessInfo.value.token}`;
}
