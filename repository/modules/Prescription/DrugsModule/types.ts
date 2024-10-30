import type { SuccessResponse } from '~/types/Response';
import type { EPrescriptionDurationType } from '~/repository/modules/ConfigModule/types';

export interface IDuration {
    duration_id?: number | null;
    type?: keyof EPrescriptionDurationType;
    duration?: number | null;
    order?: string | null;
    instruction?: string;
    frequency?: string;
    locale?: string;
}

export interface IDosageForm {
    ref: string;
    name: string;
    base_name: string;
    short_name: string;
    icon_url: string;
}

interface Generic {
    name: string;
    ref: string;
}

export interface IDrag {
    ref: string;
    pivot_ref?: string;
    prescription_ref?: string;
    comment?: string;
    durations: IDuration[];
    instructions: string[];
    drug_id: number;
    uuid: string;
    type?: string;
    name: string;
    custom_drug_id: number | null;
    is_custom_drug: boolean;
    brand_name: string;
    drug_ref: string;
    dosage_form_ref: string;
    strength: string;
    dosage_form?: IDosageForm;
    generic_name: string;
    generic_ref: string;
    generic?: Generic;
    drug?: string;
}

export interface DosageFormResponse extends SuccessResponse<[]> {}
export interface DragsResponse extends SuccessResponse<[]> {}

export interface MostUsedDrug {
    type: 'brand';
    ref: string;
    name: string;
    drug_id: number;
    generic: Generic;
    hypertension_generic_type: null | string;
    company: string;
    strength: string;
    dosage_form: IDosageForm;
}

export interface MostUsedDrugResponse extends SuccessResponse<MostUsedDrug[]> {}
