import { defineStore } from 'pinia';
import type {  IDisease } from '~/repository/modules/EHR/DiseaseHistory/types';

export const useEhrDiseaseStore = defineStore('ehr-disease-store', () => {
    const diseaseSelectList: Ref<Object | []> = ref([]);
    const diseaseSelectedList: Ref<Object | []> = ref([]);
    const { $api } = useNuxtApp();

    const searchDisease = useDebounceFn(async (query: string) => {
        try {
            const response = await $api.disease.icd_code(query);
            if (response) {
                return response.data.map((disease: any) => {
                    return {
                        ...disease,
                        icd_code_ref: disease.code,
                        disease: disease.name,
                    };
                });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('search-disease', error);
        }
    }, 500);

    const updateDisease = async (disease: IDisease) => {
        try {
            const response = await $api.disease.create(
                getPayload('events', [
                    {
                        ...disease,
                        note: disease.note,
                    },
                ]),
            );

            if (response) {
                const hasIndex = diseaseSelectedList.value.findIndex(
                    (item: IDisease) => item.icd_code_ref === response.data[0].icd_code_ref,
                );
                diseaseSelectedList.value.splice(hasIndex, 1, response.data[0]);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const removedDiseaseForPrescription = async (disease: IDisease) => {
        diseaseSelectedList.value.splice(
            diseaseSelectedList.value.findIndex((item: IDisease) => item.ref === disease.ref),
            1,
        );
        try {
            await $api.disease.delete(getPayload(undefined, disease));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('disease-delete-api', error);
        }
    };

    const setDiseaseSelectedData = (data: IDisease[]) => {
        diseaseSelectedList.value = data;
    };

    return {
        diseaseSelectedList,
        diseaseSelectList,
        searchDisease,
        setDiseaseSelectedData,
        updateDisease,
        removedDiseaseForPrescription,
    };
});
