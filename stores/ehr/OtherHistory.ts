import { defineStore } from 'pinia';

export const useOtherHistoryStore = defineStore('useOtherHistoryStore', () => {
    // Other
    const surgicalType: Ref<Array | []> = ref([]);
    const otherData: Ref<Object | null> = reactive({
        immunization: false,
        period: null,
    });

    const toast = useToast();
    const { $api } = useNuxtApp();

    async function fetchSurgicalType() {
        const { data: surgicalData } = await useApiFetch<Object>(`/ehr/surgicals`);
        if (surgicalData.value) {
            surgicalType.value = surgicalData.value.data;
        }
    }

    const createSurgicalInfo = async (data: object) => {
        try {
            const response = await $api.other.createSurgicalHistory(data);
            if (response) {
                // otherData.period = response.data;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const immunizedUpdate = async (data: Object) => {
        try {
            const response = await $api.other.updateImmunized(data);
            if (response) {
                otherData.immunization = response.data.is_immunized;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const periodUpdateOrCreate = async (data: Object) => {
        try {
            const response = await $api.other.createPeriodHistory(data);
            if (response) {
                otherData.period = response.data;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    return {
        otherData,
        surgicalType,
        fetchSurgicalType,
        createSurgicalInfo,
        immunizedUpdate,
        periodUpdateOrCreate,
    };
});
