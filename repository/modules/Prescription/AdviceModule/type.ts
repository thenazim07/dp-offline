import type { SuccessResponse } from '~/types/Response';
import type { IdenticalName } from '../../ConfigModule/types';

export interface IAdvice {
    uuid: string;
    id?: number;
    doctor_id?: number;
    item_identical_name: IdenticalName;
    name: string;
    item_id?: number;
    weight?: number;
    description: null;
}

export interface IMostUsedAdvice{
    id: number;
    name: string;
}

export interface IMostUsedAdvicesResponse extends SuccessResponse<IMostUsedAdvice[]>{}