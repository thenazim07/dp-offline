import type { SuccessResponse } from '~/types/Response';

export interface ILifeStyle {
    value: string;
    note?: string;
    name?: string;
    uuid: string;
    ref?: string;
    life_style_type_id?: number;
    type?: string;
    duration?: number;
    duration_type?: string;
    duration_locale?: string;
    duration_text?: string;
}

export interface LifeStyleResponse extends SuccessResponse<ILifeStyle> {}

export interface IMostUsedLifeStyle {
    id: number;
    ref: string;
    title: string;
}

export interface IMostUsedLifeStyleResponse extends SuccessResponse<IMostUsedLifeStyle[]> {}
