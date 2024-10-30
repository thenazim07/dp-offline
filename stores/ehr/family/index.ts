import { defineStore } from 'pinia';
import type { IFamily as Family } from '~/repository/modules/EHR/FamilyHistory/types';

export const useEhrFamilyStore = defineStore('ehr-family-store', () => {
    const { $api } = useNuxtApp();

    const familySelectedList: Ref<Object | []> = ref([]);
    const familySelectList: Ref<Object | []> = ref([]);

    const searchFamily = useDebounceFn(async (query: string) => {
        try {
            const response = await $api.family.get(query);
            if (response?.data) {
                return response.data.map((family: any) => {
                    return {
                        ...family,
                        icd_code_ref: family.code,
                        uuid: getUuid(family.name),
                        disease: family.name,
                    };
                });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('family-search-api', error);
            return [];
        }
    }, 500);

    const updateFamily = async (family: Family) => {
        try {
            const response = await $api.family.create(
                getPayload('family_histories', [
                    {
                        ...family,
                    },
                ]),
            );
            if (response) {
                const hasIndex = familySelectedList.value.findIndex(
                    (item: Family) => item.icd_code_ref === response.data[0].icd_code_ref,
                );
                familySelectedList.value.splice(hasIndex, 1, response.data[0]);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const removedFamilyForPrescription = async (family: Family) => {
        familySelectedList.value.splice(
            familySelectedList.value.findIndex((item: Family) => item.ref === family.ref),
            1,
        );
        try {
            await $api.family.delete(getPayload(undefined, family));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const setFamilySelectedData = (data: Family[]) => {
        familySelectedList.value = data;
    };

    return {
        familySelectedList,
        familySelectList,
        searchFamily,
        setFamilySelectedData,
        updateFamily,
        removedFamilyForPrescription,
    };
});
