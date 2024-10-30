// import type { FinishedResponse } from './types';
import HttpFactory from '~/repository/factory';
import type { IMostUsedLifeStyleResponse } from './types';

class EhrLifestyleHistoryModule extends HttpFactory {
    async get_life_style_type(query: string) {
        const url = query ? `/ehr/life-style-types?search_key=${query}` : `/ehr/life-style-types`;
        return await this.call('GET', url);
    }

    async get_life_style() {
        return await this.call('GET', `/ehr/life-styles`);
    }

    async create_life_style_type(data: Object) {
        return await this.call('POST', `/ehr/life-style-types`, data);
    }

    async create_life_style(data: Object) {
        return await this.call('POST', `/ehr/life-styles`, data);
    }

    async update(data: Object) {
        return await this.call('PUT', `/ehr/life-styles/${data.ref}`, data);
    }

    async delete(data: Object) {
        return await this.call('DELETE', `/ehr/life-styles/${data.ref}`, data);
    }

    async mostUsed(): Promise<IMostUsedLifeStyleResponse> {
        return await this.call<IMostUsedLifeStyleResponse>('GET', `/ehr/life-style-types/most-used`);
    }
}

export default EhrLifestyleHistoryModule;
