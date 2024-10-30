import { LoginResponse, RegisterResponse } from 'types/auth';

import HttpFactory from '../../factory';
import type { IPageSetUpData } from './types';

class PageLayoutModule extends HttpFactory {
    private PAGE_SETUP = '/doctors/page-layout?page=';

    async getLayout(query = ''): Promise<LoginResponse> {
        return await this.call<ILoginResponse>('GET', `/doctors/page-layout?page=${query}`);
    }

    async getPrescription(prescription_ref: String): Promise<LoginResponse> {
        return await this.call<ILoginResponse>(
            'GET',
            `/eprescription/prescriptions/${prescription_ref}?scheme=json&version=${
                useRuntimeConfig().public.PRESCRIPTION_VERSION
            }`,
        );
    }

    async delete(query = ''): Promise<LoginResponse> {
        return await this.call<ILoginResponse>('DELETE', `/doctors/page-layout?page=${query}`);
    }

    async pageSetup(page: RegisterPatient): Promise<RegisterResponse> {
        return await this.call<ICreateAccountResponse>('POST', `${'/doctors/page-layout?page=' + page.name}`, page);
    }

    async createPageLayout(body: any, page: string): Promise<any> {
        return await this.call<any>('POST', `/doctors/page-layout?page=${page}`, body);
    }
}

export default PageLayoutModule;
