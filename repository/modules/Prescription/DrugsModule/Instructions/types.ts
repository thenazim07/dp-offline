import type { SuccessResponse } from '~/types/Response';

export interface InstructionsResponse
    extends SuccessResponse<{
        data: {
            ref: string;
            value: string;
            pre_selected: boolean;
        };
    }> {}
