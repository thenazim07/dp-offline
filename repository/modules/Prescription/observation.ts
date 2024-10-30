import HttpFactory from '../../factory';
import type { IMostUsedObservationResponse } from './ObservationModule/types';

class PrescriptionObservationModule extends HttpFactory {
    private GET = '/eprescription/observations';
    private POST = '/eprescription/prescriptions/observation';
    private DELETE = '/eprescription/prescriptions/observation';

    async get(query) {
        return await this.call('GET', `${this.GET}${query}`);
    }

    async create(data: object) {
        return await this.call('POST', `${this.POST}`, data);
    }

    async createForMulti(diagnosis: object) {
        return await this.call('POST', `${this.POST}s`, diagnosis);
    }

    async edit(data: object) {
        return await this.call(
            'PUT',
            `/eprescription/prescriptions/${data.prescription_ref}}/observations/${data.ref}`,
            data,
        );
    }

    async delete(data: any) {
        return await this.call('DELETE', `${this.DELETE}`, data);
    }

    async mostUsedObservations(): Promise<IMostUsedObservationResponse> {
        return await this.call<IMostUsedObservationResponse>('GET', `/eprescription/observations/most-used`);
    }
}

export default PrescriptionObservationModule;
