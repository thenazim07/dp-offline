import type { FinishedResponse } from './types';
import HttpFactory from '~/repository/factory';

class DoctorModule extends HttpFactory {
    async dashboardOverviewFilter(query: string | undefined = undefined) {
        const url = query ? `/doctors/dashboard?${query}` : `/doctors/dashboard`;
        return await this.call<FinishedResponse>('GET', url, undefined);
    }
}

export default DoctorModule;
