import HttpFactory from '~/repository/factory';
import type {
    Investigation,
    InvestigationResponse,
    InvestigationUpdateResponse,
} from '~/repository/modules/EHR/InvestigationsHistory/types';

class EhrInvestigationsHistoryModule extends HttpFactory {
    async get(query: string) {
        return await this.call<InvestigationResponse>('GET', `/investigations?query=${query}`);
    }

    async create(data: object) {
        return await this.call<InvestigationResponse>('POST', `/ehr/investigation-reports`, data);
    }

    async update(data: object) {
        return await this.call<InvestigationUpdateResponse>('PUT', `/ehr/investigation-reports/${data.ref}`, data);
    }

    async delete(data: Investigation) {
        return await this.call('DELETE', `/ehr/investigation-reports/${data.ehr_ref}`, data);
    }
}

export default EhrInvestigationsHistoryModule;
