import type { SuccessResponse } from '~/types/Response';

export interface IPrescriptionPreferences {
    weight: boolean;
    height: boolean;
    bmi: boolean;
    bsi: boolean;
}

interface Finished {
    type: string;
    ref: string;
    name: string;
    hypertension_generic_type?: any;
    generic?: any;
    company?: any;
    strength: string;
    prescription_preferences: IPrescriptionPreferences;
    ehr: any[];
    prescription: object;
}

export interface FinishedResponse extends SuccessResponse<Finished> {}
