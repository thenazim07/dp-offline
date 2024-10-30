import type { SuccessResponse } from '~/types/Response';

export interface IPastDrug {
    type: string;
    ref: string;
    drug_ref?: string;
    name: string;
    hypertension_generic_type?: any;
    duration?: string;
    duration_type?: string;
    duration_locale?: string;
    duration_text?: string;
    generic?: any;
    frequency?: string;
    company?: any;
    strength: string;
    dosage_form?: any; // for preset data
    uuid: string;
}

export interface PastDrugResponse
    extends SuccessResponse<IPastDrug[]> { }
