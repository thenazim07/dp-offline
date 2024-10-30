import { defineStore } from 'pinia';
import { Field, useFieldArray, useForm } from 'vee-validate';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionStore } from '~/stores/prescription/usePrescriptionStore';
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
}

export const useObservationStore = defineStore('useObservationStore', () => {
    const usePreset = usePrescriptionPresetStore();
    const group = usePrescriptionGroupStore();
    const { createGroup, updateGroup, fetchGroupData } = group;
    const { selectedPatient } = storeToRefs(usePrescriptionStore());

    const identicalName = 'observation';
    const activeIndex: Ref<number> = ref(0);
    const vitalsInfo: Ref<any | []> = ref([]);

    const form = ref({
        vitals: {
            bp: { systolic: null, diastolic: null, from_left_hand: 1, bpm: null },
            bpm: null,
            temp_as_fahrenheit: null,
            SPO2: null,
            A1C: null,
            extra_cal: null,
            target_daily_cal: null,
        },
        patient_data: {
            weight: selectedPatient.value?.weight || '',
            height_in_feet: selectedPatient.value?.height_in_feet || '',
            height_in_inch: selectedPatient.value?.height_in_inch || '',
        },
    });

    const observationSelectionList: Ref<Array<any>> = ref([]);
    const observationSearchResult: Ref<Array<any>> = ref([]);
    const observationSearchLoading: Ref<Boolean | false> = ref(false);
    const observationCreateLoading: Ref<Boolean | false> = ref(false);
    const observationUpdateLoading: Ref<Boolean | false> = ref(false);
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

    const searchObservation = useDebounceFn(async (query: string) => {
        try {
            const response = await $api.observation.get(`?search_key=${query}`);
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
            observations: [],
        },
    });

    const { remove, insert, fields } = useFieldArray('observations');

    function addNewItem(item: any) {
        if (!item) return;
        const normalObject = copyObject(item);
        const items = deepCopyWithIndentation(values);
        if (!items.observations) resetForm();
        // metch only uuid
        if (checkForDuplicate(items, item, 'observations', 'Already exists')) return;

        if (isSelectedMode.value) {
            selectItemsForCreateGroup.value.push(normalObject.name);
        }

        insert(0, { ...normalObject });
    }

    function modalToggle(value: any) {
        isOpen.value = !isOpen.value;
        if (value === false) {
            onSubmit();
            updateVitals();
            setTimeout(() => {
                resetGroupEdit();
            }, 1500);
        }
    }

    const mapSelectedItem = (item: Item) => ({
        id: item.id,
        name: item.name,
        weight: item.weight,
        ref: item.ref,
    });

    const mapSelectedItems = (selectedList: []) => {
        return selectedList.map(mapSelectedItem).reverse();
    };

    const onSubmit = handleSubmit(async (values: any) => {
        if (values.observations.length === 0) return;
        useLoading(true);
        try {
            const response = await $api.observation.createForMulti(
                getPayload('observations', mapSelectedItems(values.observations)),
            );
            if (response?.data) {
                response.data.forEach(selectObservation);
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
            selectItemsForCreateGroup.value = items.observations.map((item: any) => item.name);
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
            const response = await $api.observation.edit(getPayload(undefined, mapSelectedItem(data)));
            if (response) {
                selectObservation(response.data);
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

    const deleteObservation = async (observation: Item) => {
        try {
            removeObservation(observation);
            await $api.observation.delete(getPayload(undefined, mapSelectedItem(observation)));
        } catch (error) {
            selectObservation(observation);
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const selectObservation = (observation: Item) => {
        const indexItem = observationSelectionList.value.findIndex((item: Item) => item.ref === observation.ref);

        if (indexItem === -1) {
            observationSelectionList.value.push(observation);
            return true;
        }

        observationSelectionList.value.splice(indexItem, 1, observation);
    };

    const setObservationSelectionList = (observation: []) => {
        observationSelectionList.value = observation;
    };

    const removeVitals = () => {
        form.value.vitals = {
            bp: { systolic: null, diastolic: null, from_left_hand: 1, bpm: null },
            bpm: null,
            temp_as_fahrenheit: null,
            SPO2: null,
            A1C: null,
            extra_cal: null,
            target_daily_cal: null,
        };
        vitalsInfo.value = [];
    };

    async function updateVitals() {
        try {
            if (!form.value.vitals.bpm) return;
            const response = await $api.vitals.create(getPayload(undefined, form.value));
            if (response) {
                vitalsInfo.value = response.data;
            }
        } catch (error) {}
    }

    async function deleteVitalsItem(data: any) {
        try {
            removeObservationVaitals(data);
            await $api.vitals.delete(getPayload('ref', data));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('error message');
        }
    }

    function setVitalsData(vitals: object) {
        vitalsInfo.value.vitals = vitals;
    }

    function setVitalsFieldData(vitals: object) {
        const vitalTypes = {
            heart_rate: 'BP',
            BPM: 'bpm',
            SPO2: 'SPO2',
            A1C: 'A1C',
            temperature_in_fahrenheit: 'temp_as_fahrenheit',
        };

        for (const [type, field] of Object.entries(vitalTypes)) {
            const vital = vitals.find((item: any) => item.type === type);
            if (vital) {
                if (type === 'heart_rate') {
                    form.value.vitals.bp = vital[field];
                    if (!form.value.vitals.bp) {
                        form.value.vitals.bp = { systolic: null, diastolic: null, from_left_hand: 1, bpm: null };
                    }

                    form.value.vitals.bp.from_left_hand = Number(vital[field]?.isLeftHand ?? 1);
                } else {
                    form.value.vitals[field] = vital.value;
                }
            }
        }

        vitalsInfo.value.vitals = vitals;
    }

    const removeObservation = (observation: Item) => {
        const indexItem = observationSelectionList.value.findIndex((item) => item.name === observation.name);
        observationSelectionList.value.splice(indexItem, 1);
    };

    const removeObservationVaitals = (vitals: object) => {
        const indexItem = vitalsInfo.value.vitals.findIndex((item) => item.ref === vitals);
        vitalsInfo.value.vitals.splice(indexItem, 1);
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
                observations: [],
            },
        });
        groupInputStatus.value = 0;
        isSelectedMode.value = false;
        groupName.value = '';
        groupEditId.value = null;
        selectedGroupNames.value = [];
        selectItemsForCreateGroup.value = [];
    }

    function seActiveIndex(index: number) {
        activeIndex.value = index;
    }

    return {
        observationSearchLoading,
        observationCreateLoading,
        observationUpdateLoading,
        observationSelectionList,
        observationSearchResult,
        vitalsInfo,
        form,
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
        activeIndex,
        toggleForCreateGroup,
        saveGroup,
        setVitalsFieldData,
        checkedOrUncheckedItem,
        initialize,
        removeVitals,
        updateVitals,
        setVitalsData,
        searchObservation,
        addNewItem,
        remove,
        setObservationSelectionList,
        deleteObservation,
        removeObservation,
        deleteVitalsItem,
        singleItemUpdate,
        selectedGroup,
        editGroup,
        seActiveIndex,
        updateGroupInfo,
        resetGroupEdit,
    };
});
