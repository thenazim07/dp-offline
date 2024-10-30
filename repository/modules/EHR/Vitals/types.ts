import type { SuccessResponse } from '~/types/Response';

interface Finished {
    type: string;
    ref: string;
    name: string;
    hypertension_generic_type?: any;
    generic?: any;
    company?: any;
    strength: string;
}

export interface FinishedResponse
    extends SuccessResponse<{
        data: Finished;
    }> {}
