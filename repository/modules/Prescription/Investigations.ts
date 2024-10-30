import HttpFactory from '../../factory';
import type { IMostUsedInvestigationResponse } from './InvestigationModule/type';

class PrescriptionInvestigationsModule extends HttpFactory {
    private GET = '/eprescription/investigations';
    private POST = '/eprescription/v2/prescriptions/investigations';
    private DELETE = '/eprescription/prescriptions/investigation';

    async get(query: string) {
        return await this.call('GET', `/investigations?query=${query}`);
    }

    async create(data: object) {
        return await this.call('POST', `${this.POST}`, data);
    }

    async createForMulti(data: object) {
        return await this.call('POST', `${this.POST}`, data);
    }

    async edit(data: object) {
        return await this.call(
            'PUT',
            `/eprescription/v2/prescriptions/${data.prescription_ref}}/investigations/${data.ref}`,
            data,
        );
    }

    async delete(data: any) {
        return await this.call('DELETE', `${this.DELETE}`, data);
    }

    async mostUsedInvestigations(): Promise<IMostUsedInvestigationResponse> {
        return await this.call<IMostUsedInvestigationResponse>('GET', `/eprescription/investigations/most-used`);
    }
}

export default PrescriptionInvestigationsModule;
