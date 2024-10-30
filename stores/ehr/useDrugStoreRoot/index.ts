import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import type { IPastDrug } from '~/repository/modules/EHR/PastDrugHistory/types';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

export const useEhrDrugStoreRoot = defineStore('ehr-drug-store-root', () => {
    const { $api } = useNuxtApp();
    const drugList: Ref<IPastDrug[]> = ref([emptyDrug()]);

    //helper method
    const getAvailableDrug = computed(() => drugList.value.slice(0, -1));

    const getOnlySelectedDrugNames = computed(() => getAvailableDrug.value.map((drug: IPastDrug) => drug.name));

    function updateDrug<T extends keyof IPastDrug>(index: number, key: T, value: IPastDrug[T]) {
        drugList.value.splice(index, 1, {
            ...drugList.value[index],
            [key]: value,
        });

        if (index === drugList.value.length - 1) {
            addNewBlankDrug();
        }
    }

    function addNewBlankDrug() {
        drugList.value.push(emptyDrug());
    }

    function addNewDrug<T extends keyof IPastDrug>(data?: Record<T, IPastDrug[T]>) {
        const index = drugList.value.length === 0 ? 0 : drugList.value.length - 1;
        drugList.value = [...drugList.value.slice(0, index), emptyDrug(data), ...drugList.value.slice(index)];
    }

    function emptyDrug<T extends keyof IPastDrug>(data?: Record<T, IPastDrug[T]>): IPastDrug {
        const defaultDrug: IPastDrug = {
            type: 'brand',
            ref: '',
            drug_ref: 'UniqueRef',
            name: '',
            hypertension_generic_type: '',
            generic: '',
            company: '',
            strength: '',
            duration: undefined,
            duration_type: '',
            duration_locale: 'en',
            uuid: uuid(),
        };

        return {
            ...defaultDrug,
            ...data,
        };
    }

    function deleteDrug(index: number): void {
        drugList.value = drugList.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedDrugNames.value.includes(name);
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    const syncWithServer = async () => {
        try {
            status.value.past_history_drug.status = 'pending';

            const response = await $api.pastDrug.createPastDrugHistoryMultiple(
                getPayload('drugs', useRemoveObjectWithEmptyProperty(getAvailableDrug.value, 'name')),
            );
            console.log(response, 'success-ehr-disease-store-api');

            updateServerData(response.data);

            savingStatusStore.changeStatusSuccess('past_history_drug');
        } catch (error) {
            console.log(error);
            status.value.past_history_drug.status = 'failed';
            toast.add({
                title: 'Your internet connection is slow </br> Some changes could not be saved',
                color: 'red',
            });
        } finally {
            // status.value.past_history_drug.loading = false;
        }
    };

    function updateServerData(_drug: IPastDrug[]) {
        drugList.value = [
            ..._drug.map((drug) => ({ ...drug, name: generateDrugUniqName(drug, true), uuid: uuid() })),
            emptyDrug(),
        ];
    }

    function removeDrugFromPrescription(uuid: string) {
        const drug = drugList.value.find((item) => item.uuid === uuid);

        if (!drug) return;

        drugList.value = drugList.value.filter((_drug: any) => _drug.uuid !== drug.uuid);

        if (!drug.ref) return;

        $api.pastDrug.delete(getPayload(undefined, unref(drug)));
    }

    function $reset() {
        drugList.value = [emptyDrug()];
    }

    return {
        //getters
        drugList,
        getAvailableDrug,

        //actions
        syncWithServer,
        updateServerData,
        addNewDrug,
        updateDrug,
        isAlreadySelected,
        deleteDrug,
        removeDrugFromPrescription,
        $reset,
    };
});
