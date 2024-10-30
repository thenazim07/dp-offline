import HttpFactory from '../../factory';
import type { IMostUsedIndicationResponse } from './IndicationModule/types';

class PrescriptionIndicationsModule extends HttpFactory {
    private INDICATIONS = '/eprescription/indications';
    private PATIENTS_CREATE = '/eprescription/prescriptions/indication';
    private DELETE = '/eprescription/prescriptions/indication';

    async get(query) {
        return await this.call('GET', `${this.INDICATIONS}${query}`);
    }

    async create(indications: object) {
        return await this.call('POST', `${this.PATIENTS_CREATE}`, indications);
    }

    async createForMulti(indications: object) {
        return await this.call('POST', `/eprescription/v2/prescriptions/indications`, indications);
    }

    async edit(indications: object) {
        return await this.call(
            'PUT',
            `/eprescription/v2/prescriptions/${indications.prescription_ref}/indications/${indications.ref}`,
            indications,
        );
    }

    async delete(indications: object) {
        return await this.call('DELETE', `${this.DELETE}`, indications);
    }

    async getMostUsedIndications(): Promise<IMostUsedIndicationResponse> {
        return await this.call<IMostUsedIndicationResponse>('GET', `/eprescription/indications/most-used`);
    }
}

export default PrescriptionIndicationsModule;
