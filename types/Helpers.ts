export type DeepPartial<T> = {
    [K in keyof T]?: DeepPartial<T[K]>;
};

export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
