import type { SuccessResponse } from '~/types/Response';

export type BodyPosition = 'left' | 'right' | 'top' | 'bottom';

export interface IInvestigation {
    uuid?: string;
    prescription_ref?: string;
    ref?: string;
    client_ref?: string | null;
    investigation_id?: number;
    name: string;
    description: null | string;
    body_position?: BodyPosition;
    instruction: string;
    result: string;
    result_unit: string;
    weight?: number;
}

export interface IMostUsedInvestigation {
    name: string;
    ref: string;
}

export interface IMostUsedInvestigationResponse extends SuccessResponse<IMostUsedInvestigation[]> {}
