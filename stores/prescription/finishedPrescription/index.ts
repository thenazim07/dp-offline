import { defineStore } from 'pinia';
import { usePrescriptionStore } from '../usePrescriptionStore';
export const usePrescriptionFinishedStore = defineStore('prescription-finished-store', () => {
    const { $api } = useNuxtApp();

    async function featchPrescriptionInformation() {
        try {
            const info = usePrescriptionInitializedInfo();

            if (!info) return;

            const response = await $api.finished.featchPrescription(info?.prescription_ref);

            if (!response?.data) return;

            usePrescriptionStore().setPrescriptionInfomation(
                response?.data?.prescription,
                response?.data?.ehr[0],
                response.data.prescription_preferences,
            );

            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('featch-prescription-api:', error);
            return [];
        }
    }

    async function featchPrescriptionForFollowUpInformation(ref: string) {
        try {
            const response = await $api.finished.featchPrescription(ref);

            if (!response?.data) return;

            usePrescriptionStore().setPrescriptionInfomation(
                response?.data?.prescription,
                response?.data?.ehr[0],
                response?.data?.prescription_preferences,
            );

            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('featch-prescription-api:', error);
            return [];
        }
    }

    return {
        featchPrescriptionInformation,
        featchPrescriptionForFollowUpInformation,
    };
});
