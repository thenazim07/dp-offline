import type { SuccessResponse } from '~/types/Response';
import type { EPrescriptionDurationType } from '../../ConfigModule/types';

export interface IDiagnosis {
    prescription_ref: string;
    ref: string;
    diagnosis_id: number;
    name: string;
    duration: null;
    duration_type: keyof EPrescriptionDurationType;
    note?: string;
    weight?: number;
    uuid: string;
}


export interface IMostUsedDiagnosis{
    id: number;
    name: string;
}

export interface IMostUsedDiagnosisResponse extends SuccessResponse<IMostUsedDiagnosis[]> {}