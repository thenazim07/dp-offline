import type { SuccessResponse } from '~/types/Response';

interface ResponseFollowUp {
    type: string;
    ref: string;
    name: string;
    hypertension_generic_type?: any;
    generic?: any;
    company?: any;
    strength: string;
}

export interface FollowUpResponse
    extends SuccessResponse<{
        data: ResponseFollowUp;
    }> {}

export type NoteSection = 'follow_up' | 'special_note';

export interface IFollowUpNote {
    uuid?: string;
    prescription_ref?: string;
    id?: number;
    note_id?: number;
    ref?: string;
    section?: NoteSection;
    content: string;
}

export interface IFollowUpAdvice {
    prescription_ref?: string;
    ref?: string;
    advice_id?: number | null;
    name: string;
    weight?: number;
    uuid?: string;
}

export interface IFollowUp {
    prescription_ref?: string;
    ref?: string;
    within?: string;
    description?: null;
    duration?: string;
    duration_type?: string;
    duration_locale?: 'en' | 'bn' | string;
    duration_text?: string;
    follow_up_date: string;
    follow_up_notes?: IFollowUpNote[];
    advice: IFollowUpAdvice[];
    date: string;
}

export interface INote {
    content: string;
}
