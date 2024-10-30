// import type { FinishedResponse } from './types';
import type { IMostUsedFamilyHistoryResponse } from './types';
import HttpFactory from '~/repository/factory';

class EhrFamilyHistoryModule extends HttpFactory {
    async get(query: string) {
        return await this.call('GET', `/doctors/diseases?query=${query}&search_area=past_family_history`);
    }

    async create(data: object) {
        return await this.call('POST', `/ehr/family-histories/icd-code`, data);
    }

    async delete(data: object) {
        return await this.call('DELETE', `/ehr/family-histories/${data.ref}`, data);
    }

    async mostUsed(): Promise<IMostUsedFamilyHistoryResponse> {
        return await this.call<IMostUsedFamilyHistoryResponse>('GET', `/ehr/family-histories/most-used`);
    }
}

export default EhrFamilyHistoryModule;
