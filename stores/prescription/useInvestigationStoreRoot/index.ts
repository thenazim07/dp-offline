import { v4 as uuid } from 'uuid';
import type { IdenticalName } from '~/repository/modules/ConfigModule/types';
import type {
    IInvestigation,
    IMostUsedInvestigation,
} from '~/repository/modules/Prescription/InvestigationModule/type';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionSavingStatusStore } from '../usePrescriptionSavingStatusStore';

export const useInvestigationStoreRoot = defineStore('investigation-store-root', () => {
    const { $api } = useNuxtApp();
    const identicalName: IdenticalName = 'investigation';
    const prescriptionTemplateStore = usePrescriptionTemplateStore();
    const prescriptionGroupStore = usePrescriptionGroupStore();
    const isShowingInvestigationEditor = ref(false);
    const investigations = ref<IInvestigation[]>([emptyInvestigation()]);
    const mostUsedInvestigations = ref<IMostUsedInvestigation[]>([]);
    const isGroupMode = ref(false);
    const selectedInvestigationListIndexToFocus = ref<number | null>(null);
    const investigationsSearchList = ref<{ id: any; name: string }[]>([]);

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

    const getAvailableInvestigations = computed(() => investigations.value.slice(0, -1));

    const getOnlySelectedInvestigationNames = computed(() =>
        getAvailableInvestigations.value.map((diagnosis) => diagnosis.name),
    );

    function updateInvestigation<T extends keyof IInvestigation>(index: number, key: T, value: IInvestigation[T]) {
        // diagnosis.value[index][key] = value;
        // diagnosis.value[index] = { ...currentDiagnosis, [key]: value };
        console.log('updateInvestigation', {
            index,
            key,
            value,
        });

        investigations.value.splice(index, 1, {
            ...investigations.value[index],
            [key]: value,
        });

        if (index === investigations.value.length - 1) {
            addNewBlankInvestigation();
        }
    }

    function addNewBlankInvestigation() {
        investigations.value.push(emptyInvestigation());
    }

    function addNewInvestigation<T extends keyof IInvestigation>(data?: Record<T, IInvestigation[T]>) {
        const index = investigations.value.length === 0 ? 0 : investigations.value.length - 1;
        investigations.value = [
            ...investigations.value.slice(0, index),
            emptyInvestigation(data),
            ...investigations.value.slice(index),
        ];
    }

    function emptyInvestigation<T extends keyof IInvestigation>(data?: Record<T, IInvestigation[T]>): IInvestigation {
        const defaultInvestigation: IInvestigation = {
            prescription_ref: undefined,
            ref: undefined,
            description: '',
            name: '',
            body_position: undefined,
            instruction: '',
            result: '',
            result_unit: '',
            weight: undefined,
            uuid: uuid(),
        };

        return {
            ...defaultInvestigation,
            ...data,
        };
    }

    function deleteInvestigation(index: number): void {
        investigations.value = investigations.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedInvestigationNames.value.includes(name);
    }

    const searchInvestigations = async (query: string) => {
        const response = await $api.investigation.get(query);
        const formattedResponse = jsonFormate(response.data, 'name');
        investigationsSearchList.value = formattedResponse;
        return formattedResponse;
    };

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
            addNewInvestigation({ name: item.name });
        });
    }

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

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    async function syncWithServer() {
        try {
            status.value.investigation.status = 'pending';

            const prescriptionInfo = usePrescriptionInitializedInfo();

            let prescriptionRef = prescriptionInfo?.prescription_ref;

            const isPrescriptionTemplateEditMode =
                prescriptionTemplateStore.isPrescriptionTemplateEditMode &&
                prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            if (isPrescriptionTemplateEditMode) {
                prescriptionRef = prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            }

            const investigationResponse = await $api.investigation.createForMulti({
                prescription_ref: prescriptionRef,
                investigations: useRemoveObjectWithEmptyProperty(investigations.value.slice(0, -1), 'name'),
            });
            updateServerData(investigationResponse.data as IInvestigation[]);

            savingStatusStore.changeStatusSuccess('investigation');
        } catch (e) {
            // console.log('indication error',e);
            status.value.investigation.status = 'failed';
            toast.add({ title: 'Your internet connection is slow</br>Some changes could not be saved', color: 'red' });
        } finally {
            // status.value.investigation.loading = false;
        }
    }

    function updateServerData(_investigations: IInvestigation[]) {
        investigations.value = [
            ..._investigations.map((investigation) => ({ ...investigation, uuid: uuid() })),
            emptyInvestigation(),
        ];
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

    async function deleteInvestigationFromList(uuid?: string) {
        const _investigations = investigations.value.find((investigation) => investigation.uuid === uuid);
        investigations.value = investigations.value.filter((investigation) => investigation.uuid !== uuid);

        if (_investigations) {
            await $api.investigation.delete(getPayload(undefined, _investigations));
        }
    }

    async function fetchMostUsedInvestigations() {
        const response = await $api.investigation.mostUsedInvestigations();
        mostUsedInvestigations.value = response.data || [];
    }

    function $reset() {
        investigations.value = [emptyInvestigation()];
        resetCurrentGroup();
    }

    return {
        // state
        investigations,
        isShowingInvestigationEditor,
        isGroupMode,
        currentGroup,
        identicalName,
        mostUsedInvestigations,
        selectedInvestigationListIndexToFocus,
        investigationsSearchList,

        // getters
        getAvailableInvestigations,
        getOnlySelectedInvestigationNames,

        // actions
        addNewBlankInvestigation,
        addNewInvestigation,
        updateInvestigation,
        deleteInvestigation,
        isAlreadySelected,
        searchInvestigations,
        editGroup,
        cancelGroupMode,
        syncWithServer,
        updateServerData,
        saveGroup,
        deleteInvestigationFromList,
        fetchMostUsedInvestigations,
        $reset,
    };
});
