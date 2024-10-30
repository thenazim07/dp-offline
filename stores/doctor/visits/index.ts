import { defineStore } from 'pinia';

export const useDoctorVisitsStore = defineStore('doctor-visits-store', () => {
    const { $api } = useNuxtApp();

    async function fetchVisitsList(page: number | string | null = null) {
        try {
            const response = await $api.doctorVisit.fetchVisits(page);
            return response?.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('fetch-visits-list:', error);
            return [];
        }
    }

    async function prescriptionInit(visit: object) {
        try {
            const response = await $api.doctorVisit.visitInit({
                ...visit,
                version: useRuntimeConfig().public.PRESCRIPTION_VERSION,
            });
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error during prescription initialization:', error);
        }
    }

    return {
        fetchVisitsList,
        prescriptionInit,
    };
});
