import type { SuccessResponse } from '~/types/Response';

export interface Patient {
    id: number | string;
    name: string;
    age: string;
    gender: string;
    weight?: any;
    profile_photo?: any;
    contact_no?: any;
    dob: string;
    generated_patient_id: string;
    last_visit_date: string;
}

export interface PatientResponse
    extends SuccessResponse<{
        data: Patient;
    }> {}
