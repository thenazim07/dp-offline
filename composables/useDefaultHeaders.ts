export default function () {
    return () => {
        const accessToken = useAccessTokenResolver();

        return {
            Accept: 'application/json',
            Authorization: accessToken || '',
        };
    };
}
