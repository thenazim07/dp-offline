import { defineStore } from 'pinia';
import { Field, useForm, useFieldArray } from 'vee-validate';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import type { Drag } from '~/repository/modules/Prescription/DrugsModule/types';

export const usePrescriptionDrugStore = defineStore('prescription-drug-store', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();

    const usePreset = usePrescriptionPresetStore();
    const group = usePrescriptionGroupStore();
    const { createGroup, updateGroup, fetchGroupData } = group;

    const identicalName = 'medicine';
    const drugSelectionList: Ref<Array<any>> = ref([]);
    const drugCreateLoading: Ref<Boolean | false> = ref(false);
    const drugUpdateLoading: Ref<Boolean | false> = ref(false);
    const initialized: Ref<Boolean | false> = ref(false);
    const drugGenerics: Ref<Object | null> = ref({});
    const similarDrugData: Ref<Object | null> = ref({});

    const isOpen = ref(false);
    const groupName = ref('');
    const selectItemsForCreateGroup: Ref<Array<any>> = ref([]);
    const selectedGroupNames: Ref<Array<any>> = ref([]);
    const dosageForms: Ref<[]> = ref([]);
    const isSelectedMode: Ref<boolean> = ref(false);
    const groupInputStatus: Ref<number | null> = ref(0);
    const groupEditId = ref(null);

    async function initialize() {
        /* if (initialized.value) return;
        initialized.value = true;

        await usePreset.fetchPresetData(identicalName);
        await fetchGroupData(identicalName); */
        await featchDosageForms();
    }

    const searchDrug = async (query: string) => {
        try {
            const response = await $api.drug.search(query);
            if (response?.data) {
                return jsonFormate(response.data, 'drug_id');
            }
            return [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Error occurred during drug search: ${error}`);
            return [];
        }
    };

    async function featchDosageForms() {
        try {
            const response = await $api.drug.dosageForms();
            if (response && response.data) {
                dosageForms.value = response.data;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('prescription-drug-dosage-form-api', error);
        }
    }

    async function searchGenerics(query: string) {
        try {
            const response = await $api.drug.searchGenerics(query);
            if (response && response.data) {
                return response.data;
            }
            return [];
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('prescription-drug-generics-api', error);
            return [];
        }
    }

    const { handleSubmit, values, resetForm } = useForm({
        initialValues: {
            drugs: [],
        },
    });

    const { remove, insert, fields, update } = useFieldArray('drugs');

    function addNewItem({ ...item }) {
        if (!item) return;
        const normalObject = copyObject(item);
        const items = deepCopyWithIndentation(values);
        if (!items.drugs) resetForm();

        // metch only uuid
        if (checkForDuplicate(items, item, 'drugs', 'Already exists')) return;

        if (isSelectedMode.value) {
            selectItemsForCreateGroup.value.push(normalObject.drug_id);
        }

        const drug = {
            ...normalObject,
            instructions: [],
            dosage_form_ref: null,
            generic_ref: null,
            generate_key: generateRandomString(10),
            durations: [
                {
                    instruction: '',
                    frequency: '',
                    duration: '',
                    type: 'days',
                },
            ],
        };

        insert(0, {
            ...drug,
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

    const mapSelectedItem = (item: Drag) => {
        if (item.is_custom_drug && item.brand_name === '') {
            return {};
        }

        return {
            type: item.type ?? '',
            ref: item.ref ?? '',
            brand_name: item.brand_name ?? '',
            generic_ref: item.generic_ref ?? '',
            dosage_form_ref: item.dosage_form?.ref ?? item.dosage_form_ref,
            strength: item.strength ?? null,
            instructions: item.instructions.length > 0 ? [item.instructions] : [],
            comment: item.comment ?? null,
            durations: item.durations.map((x: any) => {
                return {
                    duration: x.duration ? Number(x.duration) : null,
                    type: types.includes(x.duration_type) ? x.duration_type : x.duration ? x.duration_type : '',
                    instruction: x.instruction ?? '',
                    frequency: x.frequency ?? '',
                };
            }),
        };
    };

    const mapSelectedItems = (selectedList: []) => {
        return selectedList.map(mapSelectedItem).reverse();
    };

    function getNonEmptyObjects(obj: any) {
        return Object.values(obj).filter((value) => typeof value === 'object' && Object.keys(value).length > 0);
    }

    const onSubmit = handleSubmit(async (values: any) => {
        if (values.drugs.length === 0) return;
        useLoading(true);
        try {
            const response = await $api.drug.createForMulti(
                getPayload('drugs', getNonEmptyObjects(mapSelectedItems(values.drugs))),
            );
            if (response?.data) {
                response.data.forEach(selectDrugItem);
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        } finally {
            useLoading(false);
        }
    });

    async function singleItemUpdate(data: Drag) {
        try {
            if (!data.brand_name) {
                useToast().add({ title: 'Medicine name field is required', color: 'red' });
                return false;
            }
            const response = await $api.drug.edit(getPayload(undefined, mapSelectedItem(data)));
            if (response) {
                selectDrugItem(response.data);
            }
        } catch (error) {
            toast.add({ title: error.data.message, color: 'red' });
        }
    }

    const deleteDrug = async (drug: any) => {
        try {
            removeDrug(drug);
            await $api.drug.delete(getPayload(undefined, drug));
        } catch (error) {
            selectDrugItem(drug);
        }
    };

    function toggleForCreateGroup(value: number): void {
        groupInputStatus.value = value;
        isSelectedMode.value = Boolean(value);
        if (isSelectedMode.value) {
            const items = JSON.parse(JSON.stringify(values, null, 2));
            selectItemsForCreateGroup.value = items.drugs.map((item: any) => item.drug_id);
        }
    }

    function checkedOrUncheckedItem(itemID: number | string) {
        if (!itemID) return;
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
            item_ids: selectItemsForCreateGroup.value.filter((item) => item),
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

    const selectDrugItem = (drug: Drag) => {
        if (drug?.custom_drug_id) {
            const indexItem = drugSelectionList.value.findIndex(
                (item: Drag) => item.custom_drug_id === drug.custom_drug_id,
            );
            if (indexItem === -1) {
                drugSelectionList.value.push(drug);
                return true;
            } else {
                drugSelectionList.value.splice(indexItem, 1, drug);
            }
            return true;
        }

        const indexItem = drugSelectionList.value.findIndex((item: Drag) => item.drug_id === drug.drug_id);

        if (indexItem === -1) {
            drugSelectionList.value.push(drug);
            return true;
        } else {
            drugSelectionList.value.splice(indexItem, 1, drug);
        }
    };

    const setDrugSelectionList = (drug: []) => {
        drugSelectionList.value = drug;
    };

    const removeDrug = (drug: Drag) => {
        const indexItem = drugSelectionList.value.findIndex((item) => item.ref === drug.ref);
        drugSelectionList.value.splice(indexItem, 1);
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
        const groupItemsIist = unref(group)?.group_item || [];

        const groupName = group.name;

        const groupItems = groupItemsIist.map((item: any) => (!item.drug_id ? { ...item, drug_id: item.id } : item));

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
                drugs: [],
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
        dosageForms,
        drugCreateLoading,
        drugUpdateLoading,
        drugSelectionList,
        similarDrugData,
        drugGenerics,
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
        searchGenerics,
        featchDosageForms,
        toggleForCreateGroup,
        saveGroup,
        checkedOrUncheckedItem,
        initialize,
        searchDrug,
        setDrugSelectionList,
        addNewItem,
        removeDrugItem: remove,
        update,
        remove,
        deleteDrug,
        removeDrug,
        singleItemUpdate,
        selectedGroup,
        editGroup,
        updateGroupInfo,
        resetGroupEdit,
    };
});
