import { defineStore } from 'pinia';
import { Field, useForm, useFieldArray } from 'vee-validate';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';

interface Item {
    id: number;
    indication_id: number;
    name: string;
    value: number;
    body_position: string;
    duration: string;
    duration_type: string;
    weight: string;
    ref: string;
    note: string;
}

export const useChiefComplaintsStore = defineStore('useChiefComplaintsStore', () => {
    const usePreset = usePrescriptionPresetStore();
    const group = usePrescriptionGroupStore();
    const { createGroup, updateGroup, fetchGroupData } = group;

    const identicalName = 'chief_complain';
    const chiefComplaintsSelectionList: Ref<Array<any>> = ref([]);
    const chiefComplaintsSearchResult: Ref<Array<any>> = ref([]);
    const chiefComplaintsSearchLoading: Ref<Boolean | false> = ref(false);
    const chiefComplaintsCreateLoading: Ref<Boolean | false> = ref(false);
    const chiefComplaintsUpdateLoading: Ref<Boolean | false> = ref(false);
    const initialized: Ref<Boolean | false> = ref(false);
    const { $api } = useNuxtApp();
    const toast = useToast();

    const isOpen = ref(false);
    const groupName = ref('');
    const selectItemsForCreateGroup: Ref<Array<any>> = ref([]);
    const selectedGroupNames: Ref<Array<any>> = ref([]);
    const isSelectedMode = ref(false);
    const groupInputStatus: Ref<any> = ref(0);
    const groupEditId = ref(null);

    async function initialize() {
        /*    if (initialized.value) return;
        initialized.value = true;
        await usePreset.fetchPresetData(identicalName);
        await fetchGroupData(identicalName); */
    }

    const searchChiefComplaintsTest = async (query: string) => {
        const response = await $api.indications.get(`?search_key=${query}`);
        const formattedResponse = jsonFormate(response.data, 'name');
        console.log('formattedResponse', {
            formattedResponse,
        });

        return formattedResponse;
    };

    const searchChiefComplaints = useDebounceFn(async (query: String) => {
        try {
            const response = await $api.indications.get(`?search_key=${query}`);
            if (response) {
                return jsonFormate(response.data, 'name');
            }
            return [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error, 'Search chief complaints');
            return [];
        }
    }, 500);

    const { handleSubmit, values, resetForm } = useForm({
        initialValues: {
            indications: [],
        },
    });

    const { remove, insert, fields, update } = useFieldArray('indications');

    function addNewItem(item: any) {
        if (!item) return;
        const normalObject = Object.fromEntries(Object.entries(item));
        const items = JSON.parse(JSON.stringify(values, null, 2));
        if (!items.indications) {
            resetForm();
        }
        if (items && items.indications) {
            const isDuplicate = items?.indications?.some((fieldItem: any) => fieldItem.uuid === item.uuid);
            if (isDuplicate) {
                toast.add({ title: 'Already exists', color: 'red' });
                return;
            }
        }
        if (isSelectedMode.value) {
            selectItemsForCreateGroup.value.push(normalObject.name);
        }
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

    const types = reactive(['once', 'continue', 'not_required']);

    const mapSelectedItem = (item: Item) => ({
        name: item.name,
        value: item.value ?? item.note,
        body_position: item.body_position,
        duration: item.duration,
        duration_type: types.includes(item.duration_type)
            ? item.duration_type
            : item.duration
              ? item.duration_type
              : '',
        weight: item.weight,
        ref: item.ref,
    });

    const mapSelectedItems = (selectedList: []) => {
        return selectedList.map(mapSelectedItem).reverse();
    };

    const onSubmit = handleSubmit(async (values: any) => {
        if (values.indications.length === 0) return;
        useLoading(true);
        try {
            const response = await $api.indications.createForMulti(
                getPayload('indications', mapSelectedItems(values.indications)),
            );
            if (response?.data) {
                response.data.forEach(selectChiefComplaints);
            }
        } catch (error) {
            toast.add({ title: error, color: 'red' });
        } finally {
            useLoading(false);
        }
    });

    function toggleForCreateGroup(value: number): void {
        groupInputStatus.value = value;
        isSelectedMode.value = Boolean(value);
        if (isSelectedMode.value) {
            const items = JSON.parse(JSON.stringify(values, null, 2));
            selectItemsForCreateGroup.value = items.indications.map((item: any) => item.name);
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
            if (res === false) return false;
            groupName.value = '';
            groupInputStatus.value = 0;
            selectItemsForCreateGroup.value = [];
            isSelectedMode.value = false;
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
            if (res === false) return false;
            groupName.value = '';
            groupInputStatus.value = 0;
            selectItemsForCreateGroup.value = [];
            isSelectedMode.value = false;
        });
    }

    function setChiefComplaintsSelectionList(chiefComplaints: []) {
        chiefComplaintsSelectionList.value = chiefComplaints;
    }

    function selectChiefComplaints(chiefComplaint: Item) {
        const indexItem = chiefComplaintsSelectionList.value.findIndex(
            (item: Item) => item.name === chiefComplaint.name,
        );
        if (indexItem === -1) {
            chiefComplaintsSelectionList.value.push(chiefComplaint);
        } else {
            chiefComplaintsSelectionList.value.splice(indexItem, 1, chiefComplaint);
        }
    }

    async function singleItemUpdate(data: Item) {
        try {
            const response = await $api.indications.edit(getPayload(undefined, mapSelectedItem(data)));
            if (response) {
                selectChiefComplaints(response.data);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    async function deleteChiefComplaint(chiefComplaint: Item) {
        try {
            removeChiefComplaints(chiefComplaint);
            await $api.indications.delete(getPayload(undefined, chiefComplaint));
        } catch (error) {
            selectChiefComplaints(chiefComplaint);
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    function removeChiefComplaints(chiefComplaint: Item) {
        const indexItem = chiefComplaintsSelectionList.value.findIndex(
            (item: Item) => item.name === chiefComplaint.name,
        );

        if (indexItem && selectItemsForCreateGroup.value.includes(chiefComplaint.name)) {
            selectItemsForCreateGroup.value.splice(selectItemsForCreateGroup.value.indexOf(chiefComplaint.name), 1);
        }

        if (indexItem !== -1) {
            chiefComplaintsSelectionList.value.splice(indexItem, 1);
        }
    }

    const selectedItems = computed(() => {
        const items = JSON.parse(JSON.stringify(unref(fields), null, 2));
        if (items && items.length > 0) {
            return items.map((item: any) => {
                return item?.value?.uuid;
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
                indications: [],
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
        chiefComplaintsSearchLoading,
        chiefComplaintsCreateLoading,
        chiefComplaintsUpdateLoading,
        chiefComplaintsSearchResult,
        chiefComplaintsSelectionList,
        groupName,
        isOpen,
        fields,
        addItemsList: fields,
        groupInputStatus,
        isSelectedMode,
        selectItemsForCreateGroup,
        selectedItems,
        selectedGroupNames,
        Field,
        modalToggle,
        toggleForCreateGroup,
        saveGroup,
        checkedOrUncheckedItem,
        initialize,
        searchChiefComplaints,
        addNewItem,
        remove,
        update,
        setChiefComplaintsSelectionList,
        singleItemUpdate,
        deleteChiefComplaint,
        selectedGroup,
        editGroup,
        updateGroupInfo,
        resetGroupEdit,

        searchChiefComplaintsTest,
    };
});
