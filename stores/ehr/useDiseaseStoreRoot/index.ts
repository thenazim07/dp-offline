import { defineStore } from 'pinia';
import type { IDisease, IMostUsedDisease } from '~/repository/modules/EHR/DiseaseHistory/types';
import { v4 as uuid } from 'uuid';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

export const useEhrDiseaseStoreRoot = defineStore('ehr-disease-store-root', () => {
    const { $api } = useNuxtApp();
    const diseaseList: Ref<IDisease[]> = ref([emptyDisease()]);
    const mostUsedDiseaseList = ref<IMostUsedDisease[]>([]);

    //helper method
    const getAvailableDisease = computed(() => diseaseList.value.slice(0, -1));

    const getOnlySelectedDiseaseNames = computed(() =>
        getAvailableDisease.value.map((disease: IDisease) => disease.disease),
    );

    function updateIndication<T extends keyof IDisease>(index: number, key: T, value: IDisease[T]) {
        diseaseList.value.splice(index, 1, {
            ...diseaseList.value[index],
            [key]: value,
        });

        if (index === diseaseList.value.length - 1) {
            addNewBlankDisease();
        }
    }

    function addNewBlankDisease() {
        diseaseList.value.push(emptyDisease());
    }

    function addNewDisease<T extends keyof IDisease>(data?: Record<T, IDisease[T]>) {
        const index = diseaseList.value.length === 0 ? 0 : diseaseList.value.length - 1;
        diseaseList.value = [
            ...diseaseList.value.slice(0, index),
            emptyDisease(data),
            ...diseaseList.value.slice(index),
        ];
    }

    function emptyDisease<T extends keyof IDisease>(data?: Record<T, IDisease[T]>): IDisease {
        const defaultDisease: IDisease = {
            ref: uuid(),
            name: '',
            select_note: '',
            icd_code_ref: '',
            disease: '',
            note: null,
            des: '',
            duration: null,
            duration_type: '',
            duration_locale: 'en',
            code: '',
            uuid: uuid(),
        };

        return {
            ...defaultDisease,
            ...data,
        };
    }

    function deleteDisease(index: number): void {
        diseaseList.value = diseaseList.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedDiseaseNames.value.includes(name);
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    const syncWithServer = async () => {
        try {
            status.value.past_history_diseases.status = 'pending';

            // remove empty disease name
            // const formData = useArrayFilter(getAvailableDisease.value, disease => disease.name !== '');

            const response = await $api.disease.create(
                getPayload('events', useRemoveObjectWithEmptyProperty(getAvailableDisease.value, 'disease')),
            );

            console.log(response, 'success-ehr-disease-store-api');

            updateServerData(response?.data);

            savingStatusStore.changeStatusSuccess('past_history_diseases');
        } catch (error) {
            console.log(error);
            status.value.past_history_diseases.status = 'failed';
            toast.add({
                title: 'Your internet connection is slow </br> Some changes could not be saved',
                color: 'red',
            });
        } finally {
            // status.value.past_history_diseases.loading = false;
        }
    };

    function updateServerData(_disease: IDisease[]) {
        diseaseList.value = [..._disease.map((disease) => ({ ...disease, uuid: uuid() })), emptyDisease()];
    }

    function removeDiseaseFromPrescription(uuid: string) {
        const disease = diseaseList.value.find((item) => item.uuid === uuid);

        if (!disease) return;

        diseaseList.value = diseaseList.value.filter((item) => item.uuid !== disease.uuid);

        if (!disease.ref) return;

        $api.disease.delete(getPayload(undefined, disease));
    }

    async function fetchMostUsedDisease() {
        try {
            const response = await $api.disease.mostUsed();
            if (response) {
                mostUsedDiseaseList.value = response.data || [];
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('fetch-most-used-disease', error);
        }
    }

    function $reset() {
        diseaseList.value = [emptyDisease()];
    }

    return {
        // states
        mostUsedDiseaseList,

        // getters
        diseaseList,
        getAvailableDisease,

        // actions
        syncWithServer,
        updateServerData,
        addNewDisease,
        updateIndication,
        isAlreadySelected,
        deleteDisease,
        removeDiseaseFromPrescription,
        fetchMostUsedDisease,
        $reset,
    };
});
