import HttpFactory from '../../factory';
import type { IMostUsedDiagnosisResponse } from './DiagnosisModule/type';
import type { IMostUsedIndicationResponse } from './IndicationModule/types';

class PrescriptionDiagnosisModule extends HttpFactory {
    private DIAGNOSIS = '/eprescription/diagnosis';
    private Multi = '/eprescription/v2/prescriptions/diagnoses';
    private POST_DELETE = '/eprescription/prescriptions/diagnosis';

    async get(query) {
        return await this.call('GET', `${this.DIAGNOSIS}${query}`);
    }

    async create(diagnosis: object) {
        return await this.call('POST', `${this.POST_DELETE}`, diagnosis);
    }

    async createForMulti(diagnosis: object) {
        return await this.call('POST', `${this.Multi}`, diagnosis);
    }

    async edit(diagnosis: object) {
        return await this.call(
            'PUT',
            `/eprescription/v2/prescriptions/${diagnosis.prescription_ref}/diagnoses/${diagnosis.ref}`,
            diagnosis,
        );
    }

    async delete(diagnosis: object) {
        return await this.call('DELETE', `${this.POST_DELETE}`, diagnosis);
    }

    async getMostUsedDiagnosis(): Promise<IMostUsedDiagnosisResponse> {
        return await this.call<IMostUsedDiagnosisResponse>('GET', `/eprescription/diagnosis/most-used`);
    }
}

export default PrescriptionDiagnosisModule;
