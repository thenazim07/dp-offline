import type { SuccessResponse } from '~/types/Response';

export interface IInvestigation {
    ref: string;
    name: string;
    result?: string | number;
    ehr_ref?: string;
    value: string;
    reporting_date?: string;
    note?: string;
    uuid: string;
    weight?: string;
    result_unit?: string;
    client_ref: string;
}

export interface InvestigationResponse extends SuccessResponse<[]> {}
export interface InvestigationUpdateResponse extends SuccessResponse<IInvestigation> {}
