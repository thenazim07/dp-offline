import { v4 as uuid } from 'uuid';
import type { IDiagnosis, IMostUsedDiagnosis } from '~/repository/modules/Prescription/DiagnosisModule/type';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionSavingStatusStore } from '../usePrescriptionSavingStatusStore';

export const useDiagnosisStoreRoot = defineStore('diagnosis-store-root', () => {
    const { $api } = useNuxtApp();

    const prescriptionGroupStore = usePrescriptionGroupStore();
    const identicalName = 'diagnosis';
    const prescriptionTemplateStore = usePrescriptionTemplateStore();
    const isShowingDiagnosisEditor = ref(false);
    const mostUsedDiagnosis = ref<IMostUsedDiagnosis[]>([]);
    const diagnoses = ref<IDiagnosis[]>([emptyDiagnosis()]);
    const isGroupMode = ref(false);
    const diagnosesSearchList = ref<{ id: any; name: string }[]>([]);
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

    const selectedDiagnosisListIndexToFocus = ref<number | null>(null);

    const getAvailableDiagnoses = computed(() => diagnoses.value.slice(0, -1));

    const getOnlySelectedDiagnosisNames = computed(() =>
        getAvailableDiagnoses.value.map((diagnosis) => diagnosis.name),
    );

    const searchDiagnosis = async (query: string) => {
        const response = await $api.diagnosis.get(`?search_key=${query}`);
        const formattedResponse = jsonFormate(response.data, 'name');
        console.log('formattedResponse', {
            formattedResponse,
        });
        diagnosesSearchList.value = formattedResponse;

        return formattedResponse;
    };

    function updateDiagnosis<T extends keyof IDiagnosis>(index: number, key: T, value: IDiagnosis[T]) {
        // diagnosis.value[index][key] = value;
        // diagnosis.value[index] = { ...currentDiagnosis, [key]: value };
        console.log('updateDiagnosis', {
            index,
            key,
            value,
        });

        diagnoses.value.splice(index, 1, {
            ...diagnoses.value[index],
            [key]: value,
        });

        if (index === diagnoses.value.length - 1) {
            addNewBlankDiagnosis();
        }
    }

    function addNewBlankDiagnosis() {
        diagnoses.value.push(emptyDiagnosis());
    }

    function addNewDiagnosis<T extends keyof IDiagnosis>(data?: Record<T, IDiagnosis[T]>) {
        const index = diagnoses.value.length === 0 ? 0 : diagnoses.value.length - 1;
        diagnoses.value = [...diagnoses.value.slice(0, index), emptyDiagnosis(data), ...diagnoses.value.slice(index)];
    }

    function emptyDiagnosis<T extends keyof IDiagnosis>(data?: Record<T, IDiagnosis[T]>): IDiagnosis {
        const defaultDiagnosis: IDiagnosis = {
            prescription_ref: '',
            ref: '',
            diagnosis_id: 0,
            name: '',
            duration: null,
            duration_type: 'days',
            note: '',
            weight: 0,
            uuid: uuid(),
        };

        return {
            ...defaultDiagnosis,
            ...data,
        };
    }

    function deleteDiagnosis(index: number): void {
        diagnoses.value = diagnoses.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedDiagnosisNames.value.includes(name);
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
            addNewDiagnosis({ name: item.name });
        });
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    async function syncWithServer() {
        try {
            status.value.diagnosis.status = 'pending';

            const prescriptionInfo = usePrescriptionInitializedInfo();

            let prescriptionRef = prescriptionInfo?.prescription_ref;

            const isPrescriptionTemplateEditMode =
                prescriptionTemplateStore.isPrescriptionTemplateEditMode &&
                prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            if (isPrescriptionTemplateEditMode) {
                prescriptionRef = prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            }

            const diagnosesResponse = await $api.diagnosis.createForMulti({
                prescription_ref: prescriptionRef,
                diagnoses: useRemoveObjectWithEmptyProperty(diagnoses.value.slice(0, -1), 'name'),
            });

            updateServerData(diagnosesResponse.data as IDiagnosis[]);

            savingStatusStore.changeStatusSuccess('diagnosis');
        } catch (e) {
            // console.log('indication error',e);
            status.value.diagnosis.status = 'failed';
            toast.add({ title: 'Your internet connection is slow</br>Some changes could not be saved', color: 'red' });
        } finally {
            status.value.diagnosis.loading = false;
        }
    }

    function updateServerData(_diagnoses: IDiagnosis[]) {
        diagnoses.value = [..._diagnoses.map((diagnosis) => ({ ...diagnosis, uuid: uuid() })), emptyDiagnosis()];
    }

    async function deleteDiagnosisFromList(uuid?: string) {
        const _diagnosis = diagnoses.value.find((_diagnosis) => _diagnosis.uuid === uuid);
        diagnoses.value = diagnoses.value.filter((_diagnosis) => _diagnosis.uuid !== uuid);

        if (_diagnosis) {
            await $api.diagnosis.delete(getPayload(undefined, _diagnosis));
        }
    }

    function $reset() {
        diagnoses.value = [emptyDiagnosis()];
    }

    async function fetchMostUsedDiagnosis() {
        const response = await $api.diagnosis.getMostUsedDiagnosis();

        mostUsedDiagnosis.value = response.data!;
    }

    return {
        // state
        isShowingDiagnosisEditor,
        diagnoses,
        isGroupMode,
        currentGroup,
        identicalName,
        mostUsedDiagnosis,
        selectedDiagnosisListIndexToFocus,
        diagnosesSearchList,

        // getters
        getAvailableDiagnoses,
        getOnlySelectedDiagnosisNames,

        // actions
        searchDiagnosis,
        addNewBlankDiagnosis,
        addNewDiagnosis,
        updateDiagnosis,
        deleteDiagnosis,
        isAlreadySelected,
        updateServerData,
        syncWithServer,
        deleteDiagnosisFromList,

        saveGroup,
        editGroup,
        cancelGroupMode,
        $reset,
        fetchMostUsedDiagnosis,
    };
});
