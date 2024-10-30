import type { SuccessResponse } from '~/types/Response';

export interface IDisease {
    name: string;
    des?: string;
    ref?: string;
    select_note?: string;
    icd_code_ref?: string;
    disease: string;
    note?: string | null;
    duration?: string | number | null;
    duration_type?: string;
    duration_locale?: string;
    duration_text?: string;
    code?: string;
    uuid: string;
}

export interface DiseaseResponse extends SuccessResponse<IDisease[]> { }

export interface IMostUsedDisease {
    code: string;
    title: string;
}

export interface IMostUsedDiseaseResponse extends SuccessResponse<IMostUsedDisease[]> { }
