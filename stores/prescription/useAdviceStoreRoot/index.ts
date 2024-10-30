import { v4 as uuid } from 'uuid';
import type { IdenticalName } from '~/repository/modules/ConfigModule/types';
import type { IAdvice, IMostUsedAdvice } from '~/repository/modules/Prescription/AdviceModule/type';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useAdviceStore } from '../useAdviceStore';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { usePrescriptionSavingStatusStore } from '../usePrescriptionSavingStatusStore';

export const useAdviceStoreRoot = defineStore('advice-store-root', () => {
    const { $api } = useNuxtApp();
    const isShowingAdviceEditor = ref(false);
    const advices = ref<IAdvice[]>([emptyAdvice()]);
    const mostUsedAdvices = ref<IMostUsedAdvice[]>([]);
    const identicalName: IdenticalName = 'advice';
    const prescriptionTemplateStore = usePrescriptionTemplateStore();
    const prescriptionGroupStore = usePrescriptionGroupStore();
    const isGroupMode = ref(false);
    const adviceSearchList = ref<{ id: any; name: string }[]>([]);
    const currentGroup = reactive<{
        id?: number;
        identical_name: string;
        name: string;
        items: string[];
    }>(emptyGroup());
    function emptyGroup() {
        return {
            id: undefined,
            name: '',
            identical_name: identicalName,
            items: [],
        };
    }

    const selectedAdviceListIndexToFocus = ref<number | null>(null);

    const getAvailableAdvices = computed(() => advices.value.slice(0, -1));

    const getOnlySelectedAdvicesNames = computed(() => getAvailableAdvices.value.map((advice) => advice.name));

    function updateAdvice<T extends keyof IAdvice>(index: number, key: T, value: IAdvice[T]) {
        // diagnosis.value[index][key] = value;
        // diagnosis.value[index] = { ...currentDiagnosis, [key]: value };
        console.log('updateAdvice', {
            index,
            key,
            value,
        });

        advices.value.splice(index, 1, {
            ...advices.value[index],
            [key]: value,
        });

        if (index === advices.value.length - 1) {
            addNewBlankAdvice();
        }
    }

    function addNewBlankAdvice() {
        advices.value.push(emptyAdvice());
    }

    function addNewAdvice<T extends keyof IAdvice>(data?: Record<T, IAdvice[T]>) {
        const index = advices.value.length === 0 ? 0 : advices.value.length - 1;
        advices.value = [...advices.value.slice(0, index), emptyAdvice(data), ...advices.value.slice(index)];
    }

    function emptyAdvice<T extends keyof IAdvice>(data?: Record<T, IAdvice[T]>): IAdvice {
        const defaultAdvice: IAdvice = {
            uuid: uuid(),
            id: undefined,
            doctor_id: undefined,
            item_identical_name: 'advice',
            name: '',
            weight: 1,
            description: null,
        };

        return {
            ...defaultAdvice,
            ...data,
        };
    }

    function deleteAdvice(index: number): void {
        advices.value = advices.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedAdvicesNames.value.includes(name);
    }

    function cancelGroupMode() {
        isGroupMode.value = false;
        resetCurrentGroup();
    }

    function resetCurrentGroup() {
        currentGroup.id = undefined;
        currentGroup.name = '';
        currentGroup.items = [];
    }

    function editGroup(group: {
        id: number;
        identical_name: string;
        name: string;
        group_item: {
            id: number;
            name: string;
        }[];
    }) {
        isGroupMode.value = true;
        currentGroup.id = group.id;
        currentGroup.name = group.name;
        currentGroup.items = group.group_item.map((item) => item.name);

        group.group_item.forEach((item) => {
            addNewAdvice({ name: item.name });
        });
    }

    const searchAdvice = async (query: string) => {
        const response = await $api.advice.get(`?search_key=${query}`);
        const formattedResponse = jsonFormate(response.data, 'name');
        adviceSearchList.value = formattedResponse;
        return formattedResponse;
    };

    function saveGroup() {
        if (currentGroup.name === '') {
            return;
        }

        if (currentGroup.items.length === 0) {
            return;
        }

        if (currentGroup.id === undefined) {
            prescriptionGroupStore.createGroup({
                name: currentGroup.name,
                item_identical_name: identicalName,
                item_names: currentGroup.items,
            });
        } else {
            prescriptionGroupStore.updateGroup({
                id: currentGroup.id,
                name: currentGroup.name,
                item_identical_name: identicalName,
                item_names: currentGroup.items,
            });
        }

        cancelGroupMode();
    }

    async function deleteAdviceFromList(uuid?: string) {
        const _advice = advices.value.find((advice) => advice.uuid === uuid);
        advices.value = advices.value.filter((advice) => advice.uuid !== uuid);

        if (_advice) {
            await $api.advice.delete(getPayload(undefined, _advice));
        }
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    async function syncWithServer() {
        try {
            status.value.advice.status = 'pending';

            const prescriptionInfo = usePrescriptionInitializedInfo();

            let prescriptionRef = prescriptionInfo?.prescription_ref;

            const isPrescriptionTemplateEditMode =
                prescriptionTemplateStore.isPrescriptionTemplateEditMode &&
                prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            if (isPrescriptionTemplateEditMode) {
                prescriptionRef = prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            }

            // throw new Error(' hi');

            const advicesResponse = await $api.advice.createForMulti({
                prescription_ref: prescriptionRef,
                advices: useRemoveObjectWithEmptyProperty(advices.value.slice(0, -1), 'name'),
            });

            updateServerData(advicesResponse.data as IAdvice[]);

            savingStatusStore.changeStatusSuccess('advice');
        } catch (e) {
            // console.log('indication error',e);
            status.value.advice.status = 'failed';
            toast.add({ title: 'Your internet connection is slow</br>Some changes could not be saved', color: 'red' });
        } finally {
            // status.value.advice.loading = false;
        }
    }

    function updateServerData(_advices: IAdvice[]) {
        advices.value = [..._advices.map((advice) => ({ ...advice, uuid: uuid() })), emptyAdvice()];
    }

    async function fetchMostUsedAdvices() {
        const response = await $api.advice.mostUsedAdvices();
        mostUsedAdvices.value = response.data || [];
    }

    function $reset() {
        advices.value = [emptyAdvice()];
        resetCurrentGroup();
    }

    return {
        // state
        advices,
        isShowingAdviceEditor,
        isGroupMode,
        currentGroup,
        mostUsedAdvices,
        selectedAdviceListIndexToFocus,
        adviceSearchList,

        // getters
        getAvailableAdvices,
        getOnlySelectedAdvicesNames,

        // actions
        addNewBlankAdvice,
        addNewAdvice,
        updateAdvice,
        deleteAdvice,
        isAlreadySelected,
        cancelGroupMode,
        editGroup,
        searchAdvice,
        saveGroup,
        deleteAdviceFromList,
        syncWithServer,
        updateServerData,
        fetchMostUsedAdvices,
        $reset,
    };
});
