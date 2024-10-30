import type { SuccessResponse } from '~/types/Response';

export interface FrequenciesResponse
    extends SuccessResponse<{
        data: {
            ref: string;
            value: string;
            type: string;
            pre_selected: boolean;
        };
    }> {}
