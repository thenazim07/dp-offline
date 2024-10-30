import type { SuccessResponse } from '~/types/Response';

export interface VisitsResponse {
    id: string;
    patient_name: string;
    gender: string;
    company?: any;
    strength: string;
}

export interface InitResponse
    extends SuccessResponse<{
        data: [];
    }> {}
