import type { IBodySectionItemDetail } from '../PageLayoutModule/types';
import type { SuccessResponse } from '~/types/Response';

export interface PatientTitle {}
export interface DoctorTitle {}
export interface Gender {}
export interface DoctorType {}
export interface VisitType {}
export interface PageType {}
export interface PageSize {}
export interface PageMargin {}
export interface Unit {}
export interface PatientInfo {}

export type IdenticalName =
    | 'chief_complain'
    | 'diagnosis'
    | 'observation'
    | 'investigation'
    | 'medicine'
    | 'advice'
    | 'special_note'
    | 'investigation_history'
    | 'life_style_type'
    | 'icd_code';

export type EPrescriptionDurationType = {
    once: 'Once';
    day: 'Day';
    week: 'Week';
    month: 'Month';
    year: 'Year';
    continue: 'Continue';
    not_required: '';
};

export interface EHR {
    relations: string[];
    positions: string[];

    duration_types_for_past_history_disease: string[];
    duration_types_for_past_history_medication: string[];
    duration_types_for_past_history_lifestyle: string[];
    duration_types_for_past_history_others: string[];
}

export interface FollowUpDurationType {
    day: string;
    days: string;
    week: string;
    weeks: string;
    month: string;
    months: string;
    year: string;
    years: string;
}

export interface DurationType {
    name: string;
    value: {
        en: string;
        bn: string;
    };
}

interface Locale {
    name: string;
    value: string;
}

export interface duration_locale_persist_store_types {
    chief_complaint: string;
    follow_up: string;
    drug: string;
    past_history_diseases: string;
    past_history_medication: string;
    past_history_life_style: string;
    past_history_others: string;
}

export interface EPrescription {
    // duration_types: EPrescriptionDurationType;
    drug_duration_types: object;
    dose_units: undefined;
    investigation_result_units: undefined;
    follow_up_duration_types: FollowUpDurationType;
    duration_types: DurationType[];
    locales: Locale[];

    duration_types_for_drug: string[];
    duration_types_for_indication: string[];
    duration_types_for_follow_up: string[];
}

export interface IDefaultBodySection {
    name: string;
    value: string;
    default_position: {
        column: number;
        row: number;
    };
    default_styles: IBodySectionItemDetail;
}

export interface FieldResponse
    extends SuccessResponse<{
        patient_titles: PatientTitle;
        doctor_titles: DoctorTitle;
        genders: Gender[];
        doctor_types: DoctorType;
        visit_types: VisitType;
        page_type: PageType;
        page_sizes: PageSize[];
        page_margins: PageMargin;
        units: Unit;
        patient_info: PatientInfo;
        prescription_body_sections: IDefaultBodySection[];
        identical_names: IdenticalName[];
        e_prescription: EPrescription;
        ehr: EHR;
    }> {}
