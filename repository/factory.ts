import type { $Fetch } from 'ofetch';

export interface Extended$Fetch extends $Fetch {
    defaultHeaders: Function;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

class HttpFactory {
    private $fetch: Extended$Fetch;

    constructor(fetcher: Extended$Fetch) {
        this.$fetch = fetcher;
    }

    protected async call<T>(
        method: Method,
        url: string,
        data: object | undefined = undefined,
        extras: Record<string, any> = {},
    ): Promise<T> {
        const res: T = await this.$fetch(url, {
            method,
            body: data,
            ...extras,
            headers: {
                ...this.$fetch.defaultHeaders(),
                ...extras?.headers,
                test: 'hi',
            },
        });

        return res;
    }
}

export default HttpFactory;
