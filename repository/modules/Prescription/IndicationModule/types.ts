import type { SuccessResponse } from '~/types/Response';
import type { IdenticalName, EPrescriptionDurationType } from '../../ConfigModule/types';

export interface IIndication {
    id: number;
    doctor_id: number;
    item_identical_name: IdenticalName;
    name: string;
    item_id: number;
    weight: number;
    description: string | null;
    uuid: string;
    duration: number | null;
    duration_type: keyof EPrescriptionDurationType;
    duration_locale: 'en' | 'bn';
    duration_text: string;
    des: string[] | null;
    value: string;
    ref: string;
    instruction: string;
}

export type IndicationCreateItem = Pick<IIndication, 'name' | 'value' | 'duration' | 'duration_type'>;

export interface IMostUsedIndication {
    id: number;
    name: string;
}

export interface IMostUsedIndicationResponse extends SuccessResponse<IMostUsedIndication[]> {}
