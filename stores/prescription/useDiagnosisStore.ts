import { defineStore } from 'pinia';
import { Field, useFieldArray, useForm } from 'vee-validate';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';

interface Item {
    id: number;
    name: string;
    note: string;
    duration: string;
    duration_type: string;
    diagnosis_id: string;
    weight: string;
    ref: string;
}

export const useDiagnosisStore = defineStore('useDiagnosisStore', () => {
    const usePreset = usePrescriptionPresetStore();
    const group = usePrescriptionGroupStore();
    const { createGroup, updateGroup, fetchGroupData } = group;

    const identicalName = 'diagnosis';
    const diagnosisSelectionList: Ref<Array<any>> = ref([]);
    const diagnosisSearchResult: Ref<Array<any>> = ref([]);
    const diagnosisSearchLoading: Ref<Boolean | false> = ref(false);
    const diagnosisCreateLoading: Ref<Boolean | false> = ref(false);
    const diagnosisUpdateLoading: Ref<Boolean | false> = ref(false);
    const initialized: Ref<Boolean | false> = ref(false);
    const { $api } = useNuxtApp();
    const toast = useToast();

    const isOpen = ref(false);
    const groupName = ref('');
    const selectItemsForCreateGroup: Ref<Array<any>> = ref([]);
    const selectedGroupNames: Ref<Array<any>> = ref([]);
    const { durationTypes } = managePrescription();
    const isSelectedMode = ref(false);
    const groupInputStatus = ref(0);
    const groupEditId = ref(null);

    async function initialize() {
        /*  if (initialized.value) return;
        initialized.value = true;

        await usePreset.fetchPresetData(identicalName);
        await fetchGroupData(identicalName); */
    }

    const searchDiagnosis = useDebounceFn(async (query: String) => {
        try {
            const response = await $api.diagnosis.get(`?search_key=${query}`);
            if (response) {
                return jsonFormate(response.data, 'name');
            }
            return [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Search chief complaints', error);
            return [];
        }
    }, 500);

    const { handleSubmit, values, resetForm } = useForm({
        initialValues: {
            diagnoses: [],
        },
    });

    const { remove, insert, fields, update } = useFieldArray('diagnoses');

    function addNewItem(item: any) {
        if (!item) return;
        const normalObject = Object.fromEntries(Object.entries(item));
        const items = JSON.parse(JSON.stringify(values, null, 2));
        if (!items.diagnoses) {
            resetForm();
        }
        if (items && items.diagnoses) {
            const isDuplicate = items?.diagnoses?.some((fieldItem: any) => fieldItem.uuid === item.uuid);
            if (isDuplicate) {
                toast.add({ title: `${normalObject.name} this item already exists`, color: 'red' });
                return;
            }
        }
        if (isSelectedMode.value) {
            selectItemsForCreateGroup.value.push(normalObject.name);
        }
        normalObject.note = normalObject.value;
        insert(0, {
            ...normalObject,
            duration_type: 'days',
        });
    }

    function modalToggle(value: any) {
        isOpen.value = !isOpen.value;
        if (value === false) {
            onSubmit();
            setTimeout(() => {
                resetGroupEdit();
            }, 1500);
        }
    }

    const mapSelectedItem = (item: Item) => ({
        ref: item.ref,
        name: item.name,
        note: item.note ?? '',
        duration: item.duration ?? null,
        duration_type: item.duration ? item.duration_type.toLowerCase() : '',
        weight: item.weight ?? null,
    });

    const mapSelectedItems = (selectedList: []) => {
        return selectedList.map(mapSelectedItem).reverse();
    };

    const onSubmit = handleSubmit(async (values: any) => {
        if (values.diagnoses.length === 0) return;
        useLoading(true);
        try {
            const response = await $api.diagnosis.createForMulti(
                getPayload('diagnoses', mapSelectedItems(values.diagnoses)),
            );
            if (response?.data) {
                response.data.forEach(selectDiagnosis);
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        } finally {
            useLoading(false);
        }
    });

    function toggleForCreateGroup(value: number): void {
        groupInputStatus.value = value;
        isSelectedMode.value = Boolean(value);
        if (isSelectedMode.value) {
            const items = JSON.parse(JSON.stringify(values, null, 2));
            selectItemsForCreateGroup.value = items.diagnoses.map((item: any) => item.name);
        }
    }

    function checkedOrUncheckedItem(itemID: number | string) {
        const selectedItems = selectItemsForCreateGroup.value;
        // @ts-ignore
        selectItemsForCreateGroup.value.includes(itemID)
            ? (selectItemsForCreateGroup.value = selectedItems.filter((item) => item !== itemID))
            : selectedItems.push(itemID);
    }

    function saveGroup() {
        if (selectItemsForCreateGroup.value.length <= 1) {
            toast.add({ title: `To create a group, a minimum of two items must be selected.`, color: 'red' });
            return;
        }

        createGroup({
            name: groupName.value,
            item_identical_name: identicalName,
            item_names: selectItemsForCreateGroup.value,
        }).then((res: any) => {
            if (res) {
                groupName.value = '';
                groupInputStatus.value = 0;
                selectItemsForCreateGroup.value = [];
                isSelectedMode.value = false;
            }
        });
    }

    function updateGroupInfo() {
        if (selectItemsForCreateGroup.value.length <= 1) {
            toast.add({ title: `To create a group, a minimum of two items must be selected.`, color: 'red' });
            return;
        }

        updateGroup({
            id: groupEditId.value,
            name: groupName.value,
            item_identical_name: identicalName,
            item_names: selectItemsForCreateGroup.value,
        }).then((res: any) => {
            if (res) {
                groupName.value = '';
                groupInputStatus.value = 0;
                selectItemsForCreateGroup.value = [];
                isSelectedMode.value = false;
            }
        });
    }

    async function singleItemUpdate(data: Item) {
        try {
            const response = await $api.diagnosis.edit(getPayload(undefined, mapSelectedItem(data)));
            if (response) {
                selectDiagnosis(response.data);
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    }

    const deleteDiagnosis = async (diagnosis: Item) => {
        try {
            removeDiagnosis(diagnosis);
            await $api.diagnosis.delete(getPayload(undefined, mapSelectedItem(diagnosis)));
        } catch (error) {
            selectDiagnosis(diagnosis);
            toast.add({ title: error.data.message, color: 'red' });
        }
    };

    const selectDiagnosis = (diagnosis: Item) => {
        const indexItem = diagnosisSelectionList.value.findIndex(
            (item: Item) => item.diagnosis_id === diagnosis.diagnosis_id,
        );

        if (indexItem === -1) {
            diagnosisSelectionList.value.push(diagnosis);
            return true;
        }

        diagnosisSelectionList.value.splice(indexItem, 1, diagnosis);
    };

    const setDiagnosisSelectionList = (diagnosis: []) => {
        diagnosisSelectionList.value = diagnosis;
    };

    const removeDiagnosis = (diagnosis: Item) => {
        const indexItem = diagnosisSelectionList.value.findIndex((item) => item.name === diagnosis.name);
        if (indexItem && selectItemsForCreateGroup.value.includes(diagnosis.name)) {
            selectItemsForCreateGroup.value.splice(diagnosisSelectionList.value.indexOf(diagnosis.name), 1);
        }
        diagnosisSelectionList.value.splice(indexItem, 1);
    };

    const selectedItems = computed(() => {
        const items = JSON.parse(JSON.stringify(unref(fields), null, 2));
        if (fields) {
            return items.map((item: any) => {
                return item.value.uuid;
            });
        }
        return [];
    });

    function selectedGroup(group: { name: string; group_item?: any }) {
        const groupItems = unref(group)?.group_item || [];

        const groupName = group.name;

        if (selectedGroupNames.value.includes(groupName)) {
            const index = selectedGroupNames.value.indexOf(groupName);
            selectedGroupNames.value.splice(index, 1);

            const matchingIndices = findMatchingIndices(groupItems, selectedItems.value);
            matchingIndices.forEach(remove);

            return;
        }

        selectedGroupNames.value.push(groupName);

        const items = groupItems.map((item: any) => ({
            ...item,
            uuid: getUuid(item.name),
        }));

        items.forEach(addNewItem);
    }

    function editGroup(group: any) {
        groupInputStatus.value = 2;
        isSelectedMode.value = true;
        groupName.value = group.name;
        groupEditId.value = group.id;
        const groupItems = unref(group)?.group_item || [];
        if (groupItems.length > 0) {
            const items = groupItems.map((item: any) => ({
                ...item,
                uuid: getUuid(item.name),
            }));
            items.forEach(addNewItem);
            items.map((item: any) => {
                return selectItemsForCreateGroup.value.push(item.name);
            });
        }
    }

    function resetGroupEdit() {
        // @ts-ignore
        resetForm({
            values: {
                diagnoses: [],
            },
        });
        groupInputStatus.value = 0;
        isSelectedMode.value = false;
        groupName.value = '';
        groupEditId.value = null;
        selectedGroupNames.value = [];
        selectItemsForCreateGroup.value = [];
    }

    return {
        diagnosisSearchLoading,
        diagnosisCreateLoading,
        diagnosisUpdateLoading,
        diagnosisSearchResult,
        diagnosisSelectionList,
        isOpen,
        groupName,
        fields,
        addItemsList: fields,
        groupInputStatus,
        isSelectedMode,
        selectItemsForCreateGroup,
        durationTypes,
        selectedItems,
        selectedGroupNames,
        Field,
        modalToggle,
        toggleForCreateGroup,
        saveGroup,
        checkedOrUncheckedItem,
        initialize,
        searchDiagnosis,
        addNewItem,
        remove,
        update,
        setDiagnosisSelectionList,
        deleteDiagnosis,
        removeDiagnosis,
        singleItemUpdate,
        selectedGroup,
        editGroup,
        updateGroupInfo,
        resetGroupEdit,
    };
});
