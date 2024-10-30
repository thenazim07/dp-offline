import { defineStore } from 'pinia';
import { Field, useForm, useFieldArray } from 'vee-validate';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';

interface Item {
    id: number;
    weight: string;
    name: string;
    ref: string;
    advice_id: string;
    prescription_ref: string;
}

export const useAdviceStore = defineStore('useAdviceStore', () => {
    const usePreset = usePrescriptionPresetStore();
    const group = usePrescriptionGroupStore();
    const { createGroup, updateGroup, fetchGroupData } = group;

    const identicalName = 'advice';
    const adviceSelectionList: Ref<Array<any>> = ref([]);
    const adviceSearchResult: Ref<Array<any>> = ref([]);
    const adviceSearchLoading: Ref<Boolean | false> = ref(false);
    const adviceCreateLoading: Ref<Boolean | false> = ref(false);
    const adviceUpdateLoading: Ref<Boolean | false> = ref(false);

    const initialized: Ref<Boolean | false> = ref(false);
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

    const searchAdvice = useDebounceFn(async (query: string) => {
        try {
            const response = await $api.advice.get(`?search_key=${query}`);
            if (response) {
                return jsonFormate(response.data, 'name');
            }
            return [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error, 'Search advice');
            return [];
        }
    }, 500);

    const { handleSubmit, values, resetForm } = useForm({
        initialValues: {
            advices: [],
        },
    });

    const { remove, insert, fields } = useFieldArray('advices');

    function addNewItem(item: any) {
        if (!item) return;
        const normalObject = Object.fromEntries(Object.entries(item));
        const items = JSON.parse(JSON.stringify(values, null, 2));
        if (!items.advices) {
            resetForm();
        }
        if (items && items.advices) {
            const isDuplicate = items?.advices?.some((fieldItem: any) => fieldItem.uuid === item.uuid);
            if (isDuplicate) {
                toast.add({ title: 'Already exists', color: 'red' });
                return;
            }
        }
        if (isSelectedMode.value) {
            selectItemsForCreateGroup.value.push(normalObject.name);
        }
        insert(0, { ...normalObject });
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
        name: item.name,
        ref: item.ref,
        advice_id: item.advice_id,
        prescription_ref: item.prescription_ref,
        weight: item.weight ?? null,
    });

    const mapSelectedItems = (selectedList: []) => {
        return selectedList.map(mapSelectedItem).reverse();
    };

    const onSubmit = handleSubmit(async (values: any) => {
        if (values.advices.length === 0) return;
        useLoading(true);
        try {
            const response = await $api.advice.createForMulti(getPayload('advices', mapSelectedItems(values.advices)));
            if (response?.data) {
                response.data.forEach(selectAdvice);
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
            selectItemsForCreateGroup.value = items.advices.map((item: any) => item.name);
        }
    }

    function checkedOrUncheckedItem(itemID: number | string) {
        const selectedItems = selectItemsForCreateGroup.value;
        // @ts-ignore
        selectItemsForCreateGroup.value.includes(itemID)
            ? (selectItemsForCreateGroup.value = selectedItems.filter((item) => item !== itemID))
            : selectedItems.push(itemID);
    }

    async function singleItemUpdate(data: Item) {
        try {
            const response = await $api.advice.edit(getPayload(undefined, data));
            if (response) {
                selectAdvice(response.data);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
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

    const deleteAdvice = async (advice: Item) => {
        try {
            removeAdvice(advice);
            await $api.advice.delete(getPayload(undefined, mapSelectedItem(advice)));
        } catch (error) {
            selectAdvice(advice);
        }
    };

    const selectAdvice = (advice: Item) => {
        const indexItem = adviceSelectionList.value.findIndex((item: Item) => item.ref === advice.ref);

        if (indexItem === -1) {
            adviceSelectionList.value.push(advice);
        } else {
            adviceSelectionList.value.splice(indexItem, 1, advice);
        }
    };

    const setAdviceSelectionList = (advice: []) => {
        adviceSelectionList.value = advice;
    };

    const removeAdvice = (advice: Item) => {
        const indexItem = adviceSelectionList.value.findIndex((item: Item) => item.advice_id === advice.advice_id);
        if (indexItem && selectItemsForCreateGroup.value.includes(advice.name)) {
            selectItemsForCreateGroup.value.splice(selectItemsForCreateGroup.value.indexOf(advice.name), 1);
        }
        adviceSelectionList.value.splice(indexItem, 1);
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
                advices: [],
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
        adviceSearchLoading,
        adviceCreateLoading,
        adviceUpdateLoading,
        adviceSearchResult,
        adviceSelectionList,
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
        searchAdvice,
        addNewItem,
        remove,
        setAdviceSelectionList,
        singleItemUpdate,
        deleteAdvice,
        selectedGroup,
        editGroup,
        removeAdvice,
        updateGroupInfo,
        resetGroupEdit,
    };
});
