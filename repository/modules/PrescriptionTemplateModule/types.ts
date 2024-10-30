import type { IPaginatedSuccessResponse, SuccessResponse } from '~/types/Response';

export interface IPrescriptionTemplateStorePayload {
    name: string;
    description: string;
    score: number;
}

export interface IPrescriptionTemplateStoreResponse {
    id: number;
    name: string;
    description: string | null;
    prescription_ref: string;
    score: number;
}

export interface IPrescriptionTemplateStoreSuccessResponse
    extends SuccessResponse<IPrescriptionTemplateStoreResponse> {}

export interface IPrescriptionTemplate {
    id: number;
    name: string;
    description: string | null;
    prescription_ref: string;
    score: number | null;
}

export interface IPrescriptionFetchResponse extends IPaginatedSuccessResponse<IPrescriptionTemplate[]> {}

export interface IPrescriptionTemplateDeletePayload {
    id: number;
}

export interface IPrescriptionTemplateDeleteResponse {
    message: string;
}

export interface IFullPrescriptionTemplate {
    doctor_ref: string;
    visit_ref: null;
    prescription: {
        ref: string;
        advice: object[];
        diagnoses: object[];
        drugs: object[];
        indications: object[];
        investigations: object[];
        notes: object[];
        observations: object[];
    };
    prescription_template: IPrescriptionTemplate;
}

export interface IFullPrescriptionTemplateResponse extends SuccessResponse<IFullPrescriptionTemplate> {}

export interface IPrescriptionTemplateUpdatePayload extends IPrescriptionTemplateStorePayload {}

export interface IPrescriptionTemplateUpdateSuccessResponse extends IPrescriptionTemplateStoreSuccessResponse {}
