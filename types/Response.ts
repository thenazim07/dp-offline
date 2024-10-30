import { FetchError } from 'ofetch';

export type SuccessResponse<T> = {
    message: string;
    data: T | null;
};

export interface IPaginatedSuccessResponse<T> extends SuccessResponse<T> {
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export type ValidationError<T> = {
    message: string;
    errors?: Record<keyof T, string[]>;
};

export interface Error<T> extends FetchError<T> {}
