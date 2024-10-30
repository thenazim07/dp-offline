import HttpFactory from '../../factory';
import type { IMostUsedAdvicesResponse } from './AdviceModule/type';

class PrescriptionAdviceModule extends HttpFactory {
    private GET = '/eprescription/advices';
    private POST = '/eprescription/v2/prescriptions/advices';
    private DELETE = '/eprescription/prescriptions/advice';

    async get(query) {
        return await this.call('GET', `${this.GET}${query}`);
    }

    async create(data: object) {
        return await this.call('POST', `${this.POST}`, data);
    }

    async createForMulti(data: object) {
        return await this.call('POST', `${this.POST}`, data);
    }

    async edit(data: object) {
        return await this.call(
            'PUT',
            `/eprescription/prescriptions/${data.prescription_ref}}/advice/${data.ref}`,
            data,
        );
    }

    async delete(data: any) {
        return await this.call('DELETE', `${this.DELETE}`, data);
    }

    async mostUsedAdvices(): Promise<IMostUsedAdvicesResponse>{
        return await this.call<IMostUsedAdvicesResponse>('GET', '/eprescription/advices/most-used');
    }
}

export default PrescriptionAdviceModule;
