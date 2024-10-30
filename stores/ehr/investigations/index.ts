import { defineStore } from 'pinia';
import type { Investigation } from '~/repository/modules/EHR/InvestigationsHistory/types';

export const useEhrInvestigationHistoryStore = defineStore('use-investgation-history-store', () => {
    const { $api } = useNuxtApp();

    const investigationSelectList: Ref<Array<Investigation> | []> = ref([]);
    const investigationSelectedList: Ref<any | []> = ref([]);

    const searchInvestigation = async (query: string): Promise<Investigation[]> => {
        try {
            const response = await $api.investigationHistory.get(query);
            if (response?.data) {
                return response.data.map((investigation: Investigation) => ({
                    ...investigation,
                    inv_ref: investigation.ref,
                    uuid: getUuid(investigation.ref),
                }));
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
        return [];
    };

    const createPayload = (investigation: Investigation) => {
        const { ref, value, reporting_date, note } = investigation;

        return {
            ref,
            note,
            value,
            reporting_date: reporting_date ? useDateFormat(reporting_date, 'YYYY-MM-DD').value : null,
        };
    };

    const updateInvestigation = async (investigation: Investigation): Promise<boolean> => {
        try {
            const payload = createPayload(investigation);
            const response = await $api.investigationHistory.update(getPayload(undefined, payload));

            if (!response.data) return false;

            const hasIndex = investigationSelectedList.value.findIndex(
                (item: Investigation) => item.inv_ref === response.data.client_ref,
            );

            const dataValue = {
                ...response.data,
                inv_ref: response.data.client_ref,
                ehr_ref: response.data.ehr_ref ?? response.data.ref,
            };

            investigationSelectedList.value.splice(hasIndex, 1, dataValue);
            return true;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Failed to update investigation: ${error.message}`);
            return false;
        }
    };

    function invJsonFormate(data: any = [], key = 'name') {
        return data.map((item: any) => {
            return {
                ...item,
                inv_ref: item[key],
            };
        });
    }

    const removedInvestigation = (investgation: Investigation) => {
        const hasIndex = investigationSelectList.value.findIndex((inv) => inv.uuid === investgation.uuid);
        investigationSelectList.value.splice(hasIndex, 1);
    };

    const hasIndex = (key: any) => {
        return investigationSelectedList.value.findIndex((investigationItem) => investigationItem.inv_ref === key);
    };

    const removedInvestigationForPrescription = async (investgation: Investigation) => {
        investigationSelectedList.value.splice(hasIndex(investgation.inv_ref), 1);
        try {
            await $api.investigationHistory.delete(investgation);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const setInvestgationSelectedData = (data: Investigation[]) => {
        investigationSelectedList.value = invJsonFormate(data, 'diagnostic_ref');
    };

    const setInvestgationCreateData = (data: []) => {
        if (data.length === 0) return;
        data.forEach((item) => {
            const isRef = investigationSelectedList.value.some(({ inv_ref }) => inv_ref === item.inv_ref);

            if (isRef) return false;

            investigationSelectedList.value.push({
                ...item,
                ehr_ref: item.ehr_ref ?? item.ref,
                inv_ref: item.inv_ref ?? item.client_ref,
            });
        });
    };

    return {
        investigationSelectedList,
        investigationSelectList,
        searchInvestigation,
        setInvestgationSelectedData,
        setInvestgationCreateData,
        removedInvestigation,
        removedInvestigationForPrescription,
        updateInvestigation,
    };
});
