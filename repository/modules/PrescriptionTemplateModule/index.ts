import type {
    IFullPrescriptionTemplateResponse,
    IPrescriptionFetchResponse,
    IPrescriptionTemplateDeletePayload,
    IPrescriptionTemplateDeleteResponse,
    IPrescriptionTemplateStorePayload,
    IPrescriptionTemplateStoreSuccessResponse,
    IPrescriptionTemplateUpdatePayload,
    IPrescriptionTemplateUpdateSuccessResponse,
} from './types';
import HttpFactory from '~/repository/factory';

class PrescriptionTemplateModule extends HttpFactory {
    async fetchPrescriptionTemplates(): Promise<IPrescriptionFetchResponse> {
        return await this.call<IPrescriptionFetchResponse>('GET', '/doctors/prescription-templates');
    }

    async createPrescriptionTemplate(
        payload: IPrescriptionTemplateStorePayload,
    ): Promise<IPrescriptionTemplateStoreSuccessResponse> {
        return await this.call<IPrescriptionTemplateStoreSuccessResponse>(
            'POST',
            '/doctors/prescription-templates',
            payload,
        );
    }

    async fetchPrescriptionTemplate(id: string | number): Promise<IFullPrescriptionTemplateResponse> {
        return await this.call<IFullPrescriptionTemplateResponse>('GET', `/doctors/prescription-templates/${id}/show`);
    }

    async updatePrescriptionTemplate(
        payload: IPrescriptionTemplateUpdatePayload,
        id: number,
    ): Promise<IPrescriptionTemplateUpdateSuccessResponse> {
        return await this.call<IPrescriptionTemplateUpdateSuccessResponse>(
            'PUT',
            `/doctors/prescription-templates/${id}/update`,
            payload,
        );
    }

    async createPrescriptionSaveAsTemplate(
        payload: IPrescriptionTemplateStorePayload,
        prescription_ref: string,
    ): Promise<IPrescriptionTemplateStoreSuccessResponse> {
        return await this.call<IPrescriptionTemplateStoreSuccessResponse>(
            'POST',
            `/doctors/prescriptions/${prescription_ref}/save-as-template`,
            payload,
        );
    }

    async deletePrescriptionTemplate(
        payload: IPrescriptionTemplateDeletePayload,
    ): Promise<IPrescriptionTemplateDeleteResponse> {
        return await this.call<IPrescriptionTemplateDeleteResponse>(
            'DELETE',
            `/doctors/prescription-templates/${payload.id}/delete`,
        );
    }
}

export default PrescriptionTemplateModule;
