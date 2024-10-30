import type { VisitsResponse, InitResponse } from './types';
import HttpFactory from '~/repository/factory';

class DoctorVisitsModule extends HttpFactory {
    async visitInit(data: object) {
        return await this.call<InitResponse>('POST', `/doctors/visits/initiate`, data);
    }

    async fetchVisits(page: string | number | null = null): Promise<VisitsResponse> {
        const endpoint = page ? `/doctors/visits?page=${page}` : '/doctors/visits';
        return await this.call<VisitsResponse>('GET', endpoint);
    }
}

export default DoctorVisitsModule;
