import type { SuccessResponse } from '~/types/Response';

export interface ISurgicalStoreData {
    name: string;
    uuid: string;
    duration: number | null;
    duration_type: string;
    duration_locale: string;
    duration_text: string;
}

export interface ISurgical {
    ref: string,
    id: number,
    name: string,
}

export interface Period {
    ref: string,
    periodical_type: 'regular' | 'irregular' | 'menopause',
    note: string | null
}

export interface ResponseSurgicalData
    extends SuccessResponse<ISurgicalStoreData[]> { }
export interface ResponseImmunized
    extends SuccessResponse<{
        is_immunized: boolean
    }> { }
export interface ResponsePeriod
    extends SuccessResponse<Period> { }

export interface ResponseSurgicalType
    extends SuccessResponse<ISurgical[]> { }

