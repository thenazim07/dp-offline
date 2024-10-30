import type { SuccessResponse } from '~/types/Response';

interface ResponseFollowUp {
    type: string;
    ref: string;
    name: string;
    hypertension_generic_type?: any;
    generic?: any;
    company?: any;
    strength: string;
}

export interface FollowUpResponse
    extends SuccessResponse<{
        data: ResponseFollowUp;
    }> {}

export interface IPreset {
    id: number;
    doctor_id: number;
    item_identical_name: string;
    name: string;
    item_id: number;
    weight: number;
    description: string[];
    uuid: string;
}
