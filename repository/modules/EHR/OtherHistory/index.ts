import HttpFactory from '~/repository/factory';
import type { ResponseSurgicalType, ResponsePeriod, ResponseSurgicalData } from './types';

class EhrOtherHistoryModule extends HttpFactory {
    // Surgical
    async get_surgical() {
        return await this.call<ResponseSurgicalType>('GET', `/ehr/surgicals`);
    }

    async create_surgical(data: object) {
        return await this.call('POST', `/ehr/surgicals`, data);
    }

    // Surgical History
    async createSurgicalHistory(data: ResponseSurgicalData[]) {
        return await this.call<ResponseSurgicalData>('POST', `/ehr/surgical-histories/multiple`, data);
    }

    async updateSurgicalHistory(data: object) {
        return await this.call('PUT', `/ehr/surgical-histories/${data.ref}`, data);
    }

    async deleteSurgicalHistory(data: object) {
        return await this.call('DELETE', `/ehr/surgical-histories/${data.ref}`, data);
    }

    // Allergies
    async getAllergy() {
        return await this.call('GET', `/ehr/allergies`);
    }

    async createAllergy(data: Object) {
        return await this.call('POST', `/ehr/allergies`, data);
    }

    // Allergic History

    async createAllergicHistory(data: Object) {
        return await this.call('POST', `/ehr/allergic-histories/`, data);
    }

    async updateAllergicHistory(data: Object) {
        return await this.call('PUT', `/ehr/allergic-histories/${data.ref}`, data);
    }

    async deleteAllergicHistory(data: Object) {
        return await this.call('DELETE', `/ehr/allergic-histories/${data.ref}`, data);
    }

    // Other
    async createPeriodHistory(data: object) {
        return await this.call<ResponsePeriod>('POST', `/ehr/period-histories`, data);
    }

    async updateImmunized(data: Object) {
        return await this.call<SuccessResponse>('POST', `/ehr/patients/immunized`, data);
    }
}

export default EhrOtherHistoryModule;
