import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import type { IInvestigation } from '~/repository/modules/EHR/InvestigationsHistory/types';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

export const useEhrInvestigationStoreRoot = defineStore('ehr-investigation-store-root', () => {
    const { $api } = useNuxtApp();
    const investigationList: Ref<IInvestigation[]> = ref([emptyInvestigation()]);

    //helper method
    const getAvailableInvestigation = computed(() => investigationList.value.slice(0, -1));

    const getOnlySelectedInvestigationNames = computed(() =>
        getAvailableInvestigation.value.map((investigation: IInvestigation) => investigation.name),
    );

    function updateInvestigation<T extends keyof IInvestigation>(index: number, key: T, value: IInvestigation[T]) {
        investigationList.value.splice(index, 1, {
            ...investigationList.value[index],
            [key]: value,
        });

        if (index === investigationList.value.length - 1) {
            addNewBlankInvestigation();
        }
    }

    function addNewBlankInvestigation() {
        investigationList.value.push(emptyInvestigation());
    }

    function addNewInvestigation<T extends keyof IInvestigation>(data?: Record<T, IInvestigation[T]>) {
        const index = investigationList.value.length === 0 ? 0 : investigationList.value.length - 1;
        investigationList.value = [
            ...investigationList.value.slice(0, index),
            emptyInvestigation(data),
            ...investigationList.value.slice(index),
        ];
    }

    function emptyInvestigation<T extends keyof IInvestigation>(data?: Record<T, IInvestigation[T]>): IInvestigation {
        const defaultInvestigation: IInvestigation = {
            ref: null,
            name: '',
            result: '',
            ehr_ref: '',
            value: '',
            reporting_date: '',
            note: '',
            weight: '',
            result_unit: '',
            client_ref: '',
            uuid: uuid(),
        };

        return {
            ...defaultInvestigation,
            ...data,
        };
    }

    function deleteInvestigation(index: number): void {
        investigationList.value = investigationList.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedInvestigationNames.value.includes(name);
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    const syncWithServer = async () => {
        try {
            status.value.past_history_investigation.status = 'pending';

            const response = await $api.investigationHistory.create(
                getPayload('investigations', useRemoveObjectWithEmptyProperty(getAvailableInvestigation.value, 'name')),
            );
            console.log(response, 'success-ehr-investigation-store-api');

            if (response?.data) {
                updateServerData(
                    response?.data?.map((investigation) => ({ ...investigation, ehr_ref: investigation.ref })),
                );
            } else {
                updateServerData(response?.map((investigation) => ({ ...investigation, ehr_ref: investigation.ref })));
            }

            savingStatusStore.changeStatusSuccess('past_history_investigation');
        } catch (error) {
            console.log(error);
            status.value.past_history_investigation.status = 'failed';
            toast.add({
                title: 'Your internet connection is slow </br> Some changes could not be saved',
                color: 'red',
            });
        } finally {
            // status.value.past_history_investigation.loading = false;
        }
    };

    function updateServerData(_investigation: IInvestigation[]) {
        investigationList.value = [
            ..._investigation.map((investigation) => ({ ...investigation, ref: investigation.ehr_ref, uuid: uuid() })),
            emptyInvestigation(),
        ];
    }

    function removeInvestigationFromPrescription(uuid: string) {
        const investigation = investigationList.value.find((item) => item.uuid === uuid);

        if (!investigation) return;

        investigationList.value = investigationList.value.filter((item) => item.uuid !== investigation.uuid);

        if (!investigation.ehr_ref) return;

        $api.investigationHistory.delete(getPayload(undefined, investigation));
    }

    function $reset() {
        investigationList.value = [emptyInvestigation()];
    }

    return {
        //getters
        investigationList,
        getAvailableInvestigation,

        //actions
        syncWithServer,
        updateServerData,
        addNewInvestigation,
        updateInvestigation,
        isAlreadySelected,
        deleteInvestigation,
        removeInvestigationFromPrescription,
        $reset,
    };
});
