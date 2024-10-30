// import type { FinishedResponse } from './types';
import HttpFactory from '~/repository/factory';

class EhrPastDrugHistoryModule extends HttpFactory {
    async get(query: string) {
        return await this.call('GET', `/disease/disease?search=${query}`);
    }

    async createPastDrugHistory(data: Object) {
        return await this.call('POST', `/ehr/past-drug-histories`, data);
    }

    async createPastDrugHistoryMultiple(data: Object) {
        return await this.call('POST', `/ehr/past-drug-histories/multiple`, data);
    }

    async update(data: Object) {
        return await this.call('PUT', `/ehr/past-drug-histories/${data.ref}`, data);
    }

    async delete(data: Object) {
        return await this.call('DELETE', `/ehr/past-drug-histories/${data.ref}`, data);
    }
}

export default EhrPastDrugHistoryModule;
