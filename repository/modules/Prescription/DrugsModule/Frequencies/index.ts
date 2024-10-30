import type { FrequenciesResponse } from './types';
import HttpFactory from '~/repository/factory';

class PrescriptionDrugsModuleFrequencies extends HttpFactory {
    async get() {
        return await this.call<FrequenciesResponse>('GET', `/eprescription/frequencies`, undefined);
    }

    async getFrequenciesBySearchKey(search_key: any, drug_ref: any, dosage_form_ref: any) {
        return await this.call<FrequenciesResponse>(
            'GET',
            `/eprescription/frequencies?search_key=${search_key || ''}&drug_ref=${drug_ref || ''}&dosage_form_ref=${dosage_form_ref || ''}`,
            undefined,
        );
    }
}

export default PrescriptionDrugsModuleFrequencies;
