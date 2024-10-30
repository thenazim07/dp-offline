// import type { FinishedResponse } from './types';
import type { IMostUsedDiseaseResponse } from './types';
import HttpFactory from '~/repository/factory';

class EhrDiseaseHistoryModule extends HttpFactory {
    async get(query: string) {
        return await this.call('GET', `/ehr/diseases?search_key=${query}`);
    }

    async icd_code(query: string) {
        return await this.call('GET', `/doctors/diseases?query=${query}`);
    }

    async bsi() {
        return await this.call('GET', `/ehr/calculate/bsi`);
    }

    async create(data: object) {
        return await this.call('POST', `/ehr/events/icd-code`, data);
    }

    async delete(data: any) {
        return await this.call('DELETE', `/ehr/events/${data.ref}`, data);
    }

    async mostUsed(): Promise<IMostUsedDiseaseResponse> {
        return await this.call<IMostUsedDiseaseResponse>('GET', `/ehr/events/most-used`);
    }
}

export default EhrDiseaseHistoryModule;
