import type { SuccessResponse } from '~/types/Response';

export interface MostUsedObservation {
    id: number;
    name: string;
}

export interface IMostUsedInvestigationResponse extends SuccessResponse<MostUsedObservation[]> {}
