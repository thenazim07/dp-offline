import type { InstructionsResponse } from './types';
import HttpFactory from '~/repository/factory';
class PrescriptionDrugsModuleInstructions extends HttpFactory {
    async get() {
        return await this.call<InstructionsResponse>('GET', `/eprescription/instructions`, undefined);
    }

    async getBySerchKey(search_key: any, drug_ref: any) {
        return await this.call<InstructionsResponse>(
            'GET',
            `/eprescription/instructions?search_key=${search_key || ''}&drug_ref=${drug_ref || ''}`,
            undefined,
        );
    }
}

export default PrescriptionDrugsModuleInstructions;
