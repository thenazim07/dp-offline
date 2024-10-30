import { defineStore } from 'pinia';
import { Field, useFieldArray, useForm } from 'vee-validate';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
interface Item {
    id: number;
    name: string;
    instruction: string;
    body_position: string;
    result: string;
    result_unit: string;
    weight: string;
    ref: string;
}
export const useInvestigationStore = defineStore('useInvestigationStore', () => {
    const usePreset = usePrescriptionPresetStore();
    const group = usePrescriptionGroupStore();
    const { createGroup, updateGroup, fetchGroupData } = group;

    const identicalName = 'investigation';
    const investigationSelectionList: Ref<Array<any>> = ref([]);
    const investigationSearchResult: Ref<Array<any>> = ref([]);
    const investigationSearchLoading: Ref<boolean> = ref(false);
    const investigationCreateLoading: Ref<boolean> = ref(false);
    const investigationUpdateLoading: Ref<boolean> = ref(false);
    const initialized: Ref<boolean> = ref(false);
    const { $api } = useNuxtApp();
    const toast = useToast();

    const isOpen = ref(false);
    const groupName = ref('');
    const selectItemsForCreateGroup: Ref<Array<any>> = ref([]);
    const selectedGroupNames: Ref<Array<any>> = ref([]);
    const isSelectedMode = ref(false);
    const groupInputStatus = ref(0);
    const groupEditId = ref(null);

    async function initialize() {
        /* if (initialized.value) return;
        initialized.value = true;
        await usePreset.fetchPresetData(identicalName);
        await fetchGroupData(identicalName); */
    }

    const searchInvestigation = useDebounceFn(async (query: String) => {
        try {
            const response = await $api.investigation.get(`${query}`);
            if (response) {
                return jsonFormate(response.data, 'name');
            }
            return [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error, 'Search');
            return [];
        }
    }, 500);

    const { handleSubmit, values, resetForm } = useForm({
        initialValues: {
            investigations: [],
        },
    });

    const { remove, insert, fields, update } = useFieldArray('investigations');

    function addNewItem(item: any) {
        if (!item) return;
        const normalObject = Object.fromEntries(Object.entries(item));
        const items = JSON.parse(JSON.stringify(values, null, 2));
        if (!items.investigations) {
            resetForm();
        }
        if (items && items.investigations) {
            const isDuplicate = items?.investigations?.some((fieldItem: any) => fieldItem.uuid === item.uuid);
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

    const mapSelectedItem = (item: Item) => ({
        name: item.name || null,
        ref: item.ref || null,
        instruction: item.instruction || null,
        body_position: item.body_position || null,
        result: item.result ? item.result.toString() : null,
        weight: item.weight || null,
    });

    const mapSelectedItems = (selectedList: []) => {
        return selectedList.map(mapSelectedItem).reverse();
    };

    const onSubmit = handleSubmit(async (values: any) => {
        if (values.investigations.length === 0) return;
        useLoading(true);
        try {
            const response = await $api.investigation.createForMulti(
                getPayload('investigations', mapSelectedItems(values.investigations)),
            );
            if (response?.data) {
                response.data.forEach(selectInvestigation);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        } finally {
            useLoading(false);
        }
    });

    function toggleForCreateGroup(value: number): void {
        groupInputStatus.value = value;
        isSelectedMode.value = Boolean(value);
        if (isSelectedMode.value) {
            const items = JSON.parse(JSON.stringify(values, null, 2));
            selectItemsForCreateGroup.value = items.investigations.map((item: any) => item.name);
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
            const response = await $api.investigation.edit(getPayload(undefined, mapSelectedItem(data)));
            if (response) {
                selectInvestigation(response.data);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    const deleteInvestigation = async (investigation: Item) => {
        try {
            removeInvestigation(investigation);
            await $api.investigation.delete(getPayload(undefined, mapSelectedItem(investigation)));
        } catch (error) {
            selectInvestigation(investigation);
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const selectInvestigation = (investigation: Item) => {
        const indexItem = investigationSelectionList.value.findIndex((item: Item) => item.name === investigation.name);

        if (indexItem === -1) {
            investigationSelectionList.value.push(investigation);
            return true;
        }

        investigationSelectionList.value.splice(indexItem, 1, investigation);
    };

    const setInvestigationSelectionList = (investigation: []) => {
        investigationSelectionList.value = investigation;
    };

    const removeInvestigation = (investigation: Item) => {
        const indexItem = investigationSelectionList.value.findIndex((item: Item) => item.name === investigation.name);
        investigationSelectionList.value.splice(indexItem, 1);
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
                investigations: [],
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
        investigationSearchLoading,
        investigationCreateLoading,
        investigationUpdateLoading,
        investigationSelectionList,
        groupName,
        isOpen,
        fields,
        addItemsList: fields,
        groupInputStatus,
        isSelectedMode,
        selectItemsForCreateGroup,
        investigationSearchResult,
        selectedItems,
        selectedGroupNames,
        Field,
        modalToggle,
        toggleForCreateGroup,
        saveGroup,
        checkedOrUncheckedItem,
        initialize,
        searchInvestigation,
        addNewItem,
        remove,
        update,
        setInvestigationSelectionList,
        deleteInvestigation,
        removeInvestigation,
        singleItemUpdate,
        selectedGroup,
        editGroup,
        updateGroupInfo,
        resetGroupEdit,
    };
});
