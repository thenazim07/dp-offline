import type { SuccessResponse } from '~/types/Response';

export interface Diseases {
    id: string;
    patient_name: string;
    gender: string;
    company?: any;
    strength: string;
}

export interface DiseaseResponse
    extends SuccessResponse<{
        data: Diseases;
    }> {}
