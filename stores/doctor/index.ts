import { defineStore } from 'pinia';

export const useDoctorStore = defineStore('doctor-store', () => {
    const { $api } = useNuxtApp();

    async function featchDashboardOverviewFilterData(query: string | undefined = undefined) {
        try {
            const response = await $api.doctor.dashboardOverviewFilter(query);
            if (!response?.data) return;
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('featch-prescription-patient-api:', error);
            return [];
        }
    }

    return {
        featchDashboardOverviewFilterData,
    };
});
