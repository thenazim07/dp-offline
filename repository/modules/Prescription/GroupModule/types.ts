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
