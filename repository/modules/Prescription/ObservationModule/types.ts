import type { SuccessResponse } from '~/types/Response';

export interface IMostUsedObservation {
    id: number;
    name: string;
}

export interface IMostUsedObservationResponse extends SuccessResponse<IMostUsedObservation[]> {}
