import type { DragsResponse, Drag, MostUsedDrugResponse } from './types';
import HttpFactory from '~/repository/factory';

class PrescriptionDrugsModule extends HttpFactory {
    private GET = '/eprescription/v2';
    private POST = '/eprescription/prescriptions/drug';
    private DELETE = '/eprescription/prescriptions/drug';

    async search(query: string, searchArea: string = 'drugs') {
        return await this.call<DragsResponse>(
            'GET',
            `${this.GET}/drugs?search_key=${query}&version=${useRuntimeConfig().public.PRESCRIPTION_VERSION}&search_area=${searchArea}&with_custom_drug=1`,
            undefined,
        );
    }

    async dosageForms() {
        return await this.call<DragsResponse>('GET', `/eprescription/dosage-forms`, undefined);
    }

    async searchGenerics(query: string) {
        return await this.call<DragsResponse>('GET', `/eprescription/generics?search_key=${query}`, undefined);
    }

    async get() {
        return await this.call<DragsResponse>('GET', `${this.GET}`, undefined);
    }

    async create(data: object) {
        return await this.call<DragsResponse>('POST', `${this.POST}`, data);
    }

    async createForMulti(data: object) {
        return await this.call<DragsResponse>('POST', `/eprescription/v2/prescriptions/drugs`, data);
    }

    async edit(data: Drag) {
        return await this.call<DragsResponse>(
            'PUT',
            `/eprescription/v2/prescriptions/${data.prescription_ref}}/drugs/${data.ref}`,
            data,
        );
    }

    async delete(data: Drag) {
        return await this.call<DragsResponse>('DELETE', `${this.DELETE}`, data);
    }

    async mostUsedDrugs(): Promise<MostUsedDrugResponse> {
        return await this.call<MostUsedDrugResponse>('GET', `/eprescription/drugs/most-used`, undefined);
    }
}

export default PrescriptionDrugsModule;
