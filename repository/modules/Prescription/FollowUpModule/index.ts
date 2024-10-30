import type { FollowUpResponse } from './types';
import HttpFactory from '~/repository/factory';

class PrescriptionFollowUpModule extends HttpFactory {
    private POST = '/eprescription/v2/prescriptions/followup';
    private DELETE = '/eprescription/prescriptions/followup';

    async search(query: string, for_section: string = '') {
        return await this.call<FollowUpResponse>(
            'GET',
            `/eprescription/advices?search_key=${query}&for_section=${for_section}`,
            undefined,
        );
    }

    async create(data: object) {
        return await this.call<FollowUpResponse>('POST', `${this.POST}`, data);
    }

    async createNote(data: object) {
        return await this.call<FollowUpResponse>('POST', `/eprescription/prescriptions/notes`, data);
    }

    async createFollowUpAdvice(data: object) {
        return await this.call<FollowUpResponse>('POST', `/eprescription/v2/prescriptions/followup/advices`, data);
    }

    async edit(data: object) {
        return await this.call<FollowUpResponse>(
            'PUT',
            `/eprescription/prescriptions/${data.prescription_ref}/followup/${data.prescription_followup_ref}`,
            data,
        );
    }

    async deleteNote(data: any) {
        return await this.call<FollowUpResponse>('DELETE', `/eprescription/prescriptions/note`, data);
    }

    async deleteAdvice(data: any) {
        return await this.call<FollowUpResponse>('DELETE', `/eprescription/v2/prescriptions/followup/advice`, data);
    }

    async delete(data: any) {
        return await this.call<FollowUpResponse>('DELETE', `${this.DELETE}`, data);
    }
}

export default PrescriptionFollowUpModule;
