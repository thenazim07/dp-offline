import { defineStore } from 'pinia';
import type { IFamily, IMostUsedFamilyHistory } from '~/repository/modules/EHR/FamilyHistory/types';
import { v4 as uuid } from 'uuid';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

export const useEhrFamilyStoreRoot = defineStore('ehr-family-store-root', () => {
    const { $api } = useNuxtApp();
    const familyList: Ref<IFamily[]> = ref([emptyFamily()]);
    const mostUsedFamilyHistoryList = ref<IMostUsedFamilyHistory[]>([]);

    //helper method
    const getAvailableFamily = computed(() => familyList.value.slice(0, -1));

    const getOnlySelectedFamilyNames = computed(() =>
        getAvailableFamily.value.map((family: IFamily) => family.disease),
    );

    function updateIndication<T extends keyof IFamily>(index: number, key: T, value: IFamily[T]) {
        familyList.value.splice(index, 1, {
            ...familyList.value[index],
            [key]: value,
        });

        if (index === familyList.value.length - 1) {
            addNewBlankFamily();
        }
    }

    function addNewBlankFamily() {
        familyList.value.push(emptyFamily());
    }

    function addNewFamily<T extends keyof IFamily>(data?: Record<T, IFamily[T]>) {
        const index = familyList.value.length === 0 ? 0 : familyList.value.length - 1;
        familyList.value = [...familyList.value.slice(0, index), emptyFamily(data), ...familyList.value.slice(index)];
    }

    function emptyFamily<T extends keyof IFamily>(data?: Record<T, IFamily[T]>): IFamily {
        const defaultFamily: IFamily = {
            icd_code_ref: '',
            disease: '',
            note: '',
            relation: '',
            uuid: uuid(),
        };

        return {
            ...defaultFamily,
            ...data,
        };
    }

    function deleteFamily(index: number): void {
        familyList.value = familyList.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedFamilyNames.value.includes(name);
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    const syncWithServer = async () => {
        try {
            status.value.past_history_family.status = 'pending';

            const response = await $api.family.create(
                getPayload('family_histories', useRemoveObjectWithEmptyProperty(getAvailableFamily.value, 'disease')),
            );

            console.log(response, 'success-ehr-family-store-api');

            updateServerData(response.data);

            savingStatusStore.changeStatusSuccess('past_history_family');
        } catch (error) {
            console.log(error);
            status.value.past_history_family.status = 'failed';
            toast.add({
                title: 'Your internet connection is slow </br> Some changes could not be saved',
                color: 'red',
            });
        } finally {
            status.value.past_history_family.loading = false;
        }
    };

    function updateServerData(_family: IFamily[]) {
        familyList.value = [..._family.map((family) => ({ ...family, uuid: uuid() })), emptyFamily()];
    }

    function removeFamilyFromPrescription(uuid: string) {
        const family = familyList.value.find((item) => item.uuid === uuid);

        if (!family) return;

        familyList.value = familyList.value.filter((item) => item.uuid !== family.uuid);

        if (!family.ref) return;

        $api.family.delete(getPayload(undefined, family));
    }

    async function fetchMostUsedFamilyHistory() {
        try {
            const response = await $api.family.mostUsed();
            if (response) {
                mostUsedFamilyHistoryList.value = response.data || [];
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('fetch-most-used-family history', error);
        }
    }

    function $reset() {
        familyList.value = [emptyFamily()];
    }

    return {
        // states
        mostUsedFamilyHistoryList,

        //getters
        familyList,
        getAvailableFamily,

        //actions
        syncWithServer,
        updateServerData,
        addNewFamily,
        updateIndication,
        isAlreadySelected,
        deleteFamily,
        removeFamilyFromPrescription,
        fetchMostUsedFamilyHistory,
        $reset,
    };
});
