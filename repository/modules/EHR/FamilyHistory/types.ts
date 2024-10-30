import type { SuccessResponse } from '~/types/Response';

export interface IFamily {
    name?: string;
    icd_code_ref: string;
    note?: string;
    uuid: string;
    disease: string;
    ref?: string;
    relation?: string;
}
export interface FamilyResponse extends SuccessResponse<IFamily> {}

export interface IMostUsedFamilyHistory {
    code: string;
    title: string;
}

export interface IMostUsedFamilyHistoryResponse extends SuccessResponse<IMostUsedFamilyHistory[]> {}
