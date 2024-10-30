import type { LoginResponse } from 'types/auth';

import HttpFactory from '../factory';

class ConfigsModule extends HttpFactory {
    private LEGALS = '/configs/legals';
    private FIELDS = '/configs/fields';
    private FIELDS_v2 = '/v2/configs/fields';
    private DASHBOARD_OVERVIEW = '/doctors/dashboard';

    async legals(): Promise<LoginResponse> {
        return await this.call<ILoginResponse>('GET', `${this.LEGALS}`);
    }

    async field(): Promise<Otp> {
        return await this.call<OTPResponse>('GET', `${this.FIELDS_v2}`);
    }

    async dashboardOverview(query = ''): Promise<LoginResponse> {
        return await this.call<ILoginResponse>('GET', `${this.DASHBOARD_OVERVIEW}${query}`);
    }
}

export default ConfigsModule;
