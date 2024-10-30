import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import type { ISurgical, ISurgicalStoreData } from '~/repository/modules/EHR/OtherHistory/types';

export const useOtherHistoryStoreRoot = defineStore('ehr-other-store-root', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();

    const surgicalList: Ref<ISurgicalStoreData[]> = ref([emptySurgical()]);
    const getAvailableSurgicalList = computed(() => surgicalList.value.slice(0, -1));
    const surgicalType: Ref<ISurgical[]> = ref([]);
    const immunizationValue: Ref<boolean> = ref(false);
    const periodValue: Ref<string | null> = ref(null);
    const note: Ref<string> = ref('');

    const fetchSurgicalType = async () => {
        try {
            const response = await $api.other.get_surgical();
            surgicalType.value = response.data || [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching config legals data:', error);
        }
    };

    const createSurgicalInfo = async (data: object) => {
        try {
            const response = await $api.other.createSurgicalHistory(data);
            if (response) {
                periodValue.value = response.data || null;
            }
        } catch (error) {
            toast.add({ title: error.data?.message, color: 'red' });
        }
    };

    function updateSurgical<T extends keyof ISurgicalStoreData>(index: number, key: T, value: ISurgicalStoreData[T]) {
        surgicalList.value.splice(index, 1, {
            ...surgicalList.value[index],
            [key]: value,
        });

        if (index === surgicalList.value.length - 1) {
            addNewBlankSurgical();
        }
    }

    function addNewBlankSurgical() {
        surgicalList.value.push(emptySurgical());
    }

    function addNewSurgical<T extends keyof ISurgicalStoreData>(data?: Record<T, ISurgicalStoreData[T]>) {
        const index = surgicalList.value.length === 0 ? 0 : surgicalList.value.length - 1;
        surgicalList.value = [
            ...surgicalList.value.slice(0, index),
            emptySurgical(data),
            ...surgicalList.value.slice(index),
        ];
    }

    function emptySurgical<T extends keyof ISurgicalStoreData>(
        data?: Record<T, ISurgicalStoreData[T]>,
    ): ISurgicalStoreData {
        const defaultSurgical: ISurgicalStoreData = {
            name: '',
            uuid: uuid(),
            duration: null,
            duration_type: '',
            duration_locale: 'en',
            duration_text: '',
        };

        return {
            ...defaultSurgical,
            ...data,
        };
    }

    async function syncWithServer() {
        console.log('worked');

        try {
            const response = await $api.other.createSurgicalHistory(
                getPayload(
                    'surgical_histories',
                    useRemoveObjectWithEmptyProperty(getAvailableSurgicalList.value, 'name'),
                ),
            );

            updateServerData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function updateServerData(surgicalStoreData: ISurgicalStoreData[]) {
        surgicalList.value = [
            ...surgicalStoreData.map((surgicalItem) => ({
                ...surgicalItem,
                uuid: uuid(),
                name: surgicalItem.surgical,
            })),
            emptySurgical(),
        ];
    }

    function deleteSurgical(index: number): void {
        surgicalList.value = surgicalList.value.filter((_, i) => i !== index);
    }

    // action
    const immunizedUpdate = async () => {
        try {
            const response = await $api.other.updateImmunized(
                getPayload(undefined, {
                    is_immunized: immunizationValue.value,
                }),
            );
            if (response) {
                immunizationValue.value = response.data.is_immunized;
            }
        } catch (error) {
            toast.add({ title: error.data?.message, color: 'red' });
        }
    };

    const periodUpdateOrCreate = async () => {
        try {
            const response = await $api.other.createPeriodHistory(
                getPayload(undefined, {
                    periodical_type: periodValue.value,
                    note: note.value,
                }),
            );
            if (response) {
                periodValue.value = response.data?.periodical_type || null;
                note.value = response.data?.note || '';
            }
        } catch (error) {
            toast.add({ title: error.data?.message, color: 'red' });
        }
    };

    return {
        //getters
        surgicalList,
        immunizationValue,
        periodValue,
        surgicalType,
        note,

        //action
        fetchSurgicalType,
        createSurgicalInfo,
        immunizedUpdate,
        periodUpdateOrCreate,
        deleteSurgical,
        updateSurgical,
        addNewSurgical,
        syncWithServer,
        updateServerData,
    };
});
