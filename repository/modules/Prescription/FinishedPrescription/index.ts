import type { FinishedResponse } from './types';
import HttpFactory from '~/repository/factory';

class PrescriptionFinishedModule extends HttpFactory {
    async featchPrescription(ref: string) {
        return await this.call<FinishedResponse>('GET', `/eprescription/v2/prescriptions/${ref}`, undefined);
    }

    async prescriptionPrintPreview(ref: string) {
        return await this.call<FinishedResponse>('GET', `/eprescription/v2/prescriptions/${ref}`, undefined);
    }
}

export default PrescriptionFinishedModule;
