import { v4 as uuid } from 'uuid';
import type { IIndication, IMostUsedIndication } from '~/repository/modules/Prescription/IndicationModule/types';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

export const useChiefComplaintsStoreRoot = defineStore('useChiefComplaintsStoreRoot', () => {
    const { $api } = useNuxtApp();
    const identicalName = 'chief_complain';
    const prescriptionTemplateStore = usePrescriptionTemplateStore();
    const prescriptionGroupStore = usePrescriptionGroupStore();
    const isShowingChiefComplaintEditor = ref(false);
    const chiefComplaints = ref<IIndication[]>([emptyIndication()]);
    const isGroupMode = ref(false);
    const mostUsedIndications = ref<IMostUsedIndication[]>([]);
    const indicationsSearchList = ref<[{ id: any; name: string }]>([]);
    const toast = useToast();

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

    const selectedChiefComplainListIndexToFocus = ref<number | null>();

    const searchChiefComplaints = useDebounceFn(async (query: String) => {
        try {
            const response = await $api.indications.get(`?search_key=${query}`);
            console.log('Search chief complaints', response.data);
            return response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error, 'Search chief complaints');
            return [];
        }
    }, 500);

    const getAvailableChiefComplaints = computed(() => {
        return chiefComplaints.value.slice(0, -1);
    });

    const getOnlySelectedChiefComplaintNames = computed(() =>
        getAvailableChiefComplaints.value.map((indication) => indication.name),
    );

    function incrementIndicationDuration(index: number) {
        chiefComplaints.value[index].duration++;
    }

    function decrementIndicationDuration(index: number) {
        chiefComplaints.value[index].duration--;
    }

    function updateIndication<T extends keyof IIndication>(index: number, key: T, value: IIndication[T]) {
        // chiefComplaints.value[index][key] = value;
        // chiefComplaints.value[index] = { ...currentIndication, [key]: value };
        chiefComplaints.value.splice(index, 1, {
            ...chiefComplaints.value[index],
            [key]: value,
        });

        if (index === chiefComplaints.value.length - 1) {
            addNewBlankIndication();
        }
    }

    function addNewBlankIndication() {
        chiefComplaints.value.push(emptyIndication());
    }

    function addNewIndication<T extends keyof IIndication>(data?: Record<T, IIndication[T]>) {
        const index = chiefComplaints.value.length === 0 ? 0 : chiefComplaints.value.length - 1;
        chiefComplaints.value = [
            ...chiefComplaints.value.slice(0, index),
            emptyIndication(data),
            ...chiefComplaints.value.slice(index),
        ];
    }

    function emptyIndication<T extends keyof IIndication>(data?: Record<T, IIndication[T]>): IIndication {
        const defaultIndication: IIndication = {
            id: 0,
            doctor_id: 0,
            item_identical_name: 'chief_complain',
            name: '',
            item_id: 0,
            weight: 0,
            description: null,
            uuid: uuid(),
            duration: null,
            duration_type: '',
            duration_locale: 'en',
            des: null,
            value: '',
            instruction: '',
        };

        return {
            ...defaultIndication,
            ...data,
        };
    }

    function deleteIndication(index: number): void {
        chiefComplaints.value = chiefComplaints.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlySelectedChiefComplaintNames.value.includes(name);
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);

    async function syncWithServer() {
        try {
            status.value.chief_complaints.status = 'pending';

            const prescriptionInfo = usePrescriptionInitializedInfo();

            let prescriptionRef = prescriptionInfo?.prescription_ref;

            const isPrescriptionTemplateEditMode =
                prescriptionTemplateStore.isPrescriptionTemplateEditMode &&
                prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            if (isPrescriptionTemplateEditMode) {
                prescriptionRef = prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            }

            // throw new Error(' hi');

            const indicationsResponse = await $api.indications.createForMulti({
                prescription_ref: prescriptionRef,
                indications: useRemoveObjectWithEmptyProperty(chiefComplaints.value.slice(0, -1), 'name'),
            });

            updateServerData(indicationsResponse.data as IIndication[]);

            savingStatusStore.changeStatusSuccess('chief_complaints');
        } catch (e) {
            // console.log('indication error',e);
            status.value.chief_complaints.status = 'failed';
            toast.add({ title: 'Your internet connection is slow</br>Some changes could not be saved', color: 'red' });
        } finally {
            // status.value.chief_complaints.loading = false;
        }
    }

    function updateServerData(indications: IIndication[]) {
        chiefComplaints.value = [
            ...indications.map((indication) => ({ ...indication, uuid: uuid() })),
            emptyIndication(),
        ];
    }

    async function deleteIndicationFromList(uuid?: string) {
        const _chiefComplaint = chiefComplaints.value.find((indication) => indication.uuid === uuid);
        chiefComplaints.value = chiefComplaints.value.filter((indication) => indication.uuid !== uuid);

        if (_chiefComplaint) {
            await $api.indications.delete(getPayload(undefined, _chiefComplaint));
        }
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

    function resetCurrentGroup() {
        currentGroup.id = undefined;
        currentGroup.name = '';
        currentGroup.items = [];
    }

    function cancelGroupMode() {
        isGroupMode.value = false;
        resetCurrentGroup();
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
            addNewIndication({ name: item.name });
        });
    }

    async function fetchMostUsedIndications() {
        const response = await $api.indications.getMostUsedIndications();

        mostUsedIndications.value = response.data!;
    }

    function $reset() {
        chiefComplaints.value = [emptyIndication()];
        isShowingChiefComplaintEditor.value = false;
    }

    return {
        // state
        chiefComplaints,
        isShowingChiefComplaintEditor,
        isGroupMode,
        currentGroup,
        mostUsedIndications,
        selectedChiefComplainListIndexToFocus,
        indicationsSearchList,

        // getters
        getAvailableChiefComplaints,
        getOnlySelectedChiefComplaintNames,

        // actions
        searchChiefComplaints,
        incrementIndicationDuration,
        decrementIndicationDuration,
        addNewBlankIndication,
        addNewIndication,
        updateIndication,
        deleteIndication,
        isAlreadySelected,
        syncWithServer,
        updateServerData,
        deleteIndicationFromList,
        saveGroup,
        editGroup,
        cancelGroupMode,
        fetchMostUsedIndications,
        $reset,
    };
});
