const useApiFetch = async (url: string, options) => {
    const config = useRuntimeConfig();
    const accessToken = useAccessTokenResolver();

    return await useFetch(url, {
        baseURL: config.public.baseURL,
        onRequest({ options }) {
            options.headers = options.headers || {};
            options.headers.Accept = 'application/json';
            options.headers['Content-Type'] = 'application/json';
            options.headers.Authorization = accessToken;
        },
        ...options,
    });
};

export default useApiFetch;
