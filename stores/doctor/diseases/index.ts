import { defineStore } from 'pinia';

export const useDoctorDiseasesStore = defineStore('doctor-diseases-store', () => {
    const { $api } = useNuxtApp();

    async function featchDiseases() {
        try {
            const response = await $api.doctorDiseases.fetchDiseases();
            return response?.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('fetch-diseases-list:', error);
            return [];
        }
    }

    return {
        featchDiseases,
    };
});
