import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import { usePrescriptionGroupStore } from '../group';
import type { IDrag, IDuration, IDosageForm, MostUsedDrug } from '~/repository/modules/Prescription/DrugsModule/types';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { usePrescriptionSavingStatusStore } from '../usePrescriptionSavingStatusStore';

export const usePrescriptionDrugStore = defineStore('prescription-drug-store-root', () => {
    const { $api } = useNuxtApp();
    const identicalName = 'medicine';
    const prescriptionGroupStore = usePrescriptionGroupStore();
    const prescriptionTemplateStore = usePrescriptionTemplateStore();
    const isShowingDrugEditor: Ref<boolean> = ref(false);
    const dosageFormsList: Ref<IDosageForm[]> = ref([]);
    const drugs = ref<IDrag[]>([]);
    const mostUsedDrugs = ref<MostUsedDrug[]>([]);
    const selectedListIndexToFocus: Ref<null | number> = ref(null);
    const isEnterClickedOnDurationInput = ref<boolean>(false);
    const isSavingDrugs = ref<boolean>(false);

    const isGroupMode = ref(false);
    const currentGroup = reactive<{
        id?: number;
        identical_name: string;
        name: string;
        items: number[];
    }>(emptyGroup());

    function emptyGroup() {
        return {
            id: undefined,
            name: '',
            identical_name: identicalName,
            items: [],
        };
    }

    //actions
    const searchDrug = async (query: string, searchArea = 'drugs') => {
        try {
            const response = await $api.drug.search(query, searchArea);
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

    async function fetchDosageForms() {
        try {
            const response = await $api.drug.dosageForms();
            if (response) {
                dosageFormsList.value = response.data || [];
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

    //getters
    const getOnlySelectedDrugsIds = computed(() => drugs.value?.map((drug) => generateDrugUniqName(drug)));

    // helper function
    function emptyDrug<T extends keyof IDrag>(data?: Record<T, IDrag[T]>): IDrag {
        const defaultDrug: IDrag = {
            ref: '',
            prescription_ref: '',
            comment: '',
            uuid: '',
            durations: [
                {
                    duration_id: undefined,
                    type: '',
                    locale: 'bn',
                    duration: null,
                    order: null,
                    instruction: '',
                    frequency: '',
                },
            ],
            instructions: [''],
            drug_id: 0,
            custom_drug_id: null,
            is_custom_drug: false,
            name: '',
            brand_name: '',
            drug_ref: '',
            dosage_form_ref: '',
            strength: '',
            dosage_form: {
                ref: '',
                name: '',
                base_name: '',
                short_name: '',
                icon_url: '',
            },
            generic_name: '',
            generic_ref: '',
        };

        return {
            ...defaultDrug,
            ...data,
        };
    }

    function updateDrug<T extends keyof IDrag>(index: number, key: T, value: IDrag[T]) {
        drugs.value.splice(index, 1, {
            ...drugs.value[index],
            [key]: value,
        });
    }

    function updateDrugDuration<T extends keyof IDuration>(
        drugIndex: number,
        durationIndex: number,
        key: T,
        value: IDuration[T],
    ) {
        const durations = drugs.value[drugIndex]?.durations || [];
        if (durations.length === 0) return;
        durations.splice(durationIndex, 1, {
            ...durations[durationIndex],
            [key]: value,
        });
    }

    function addMoreDrug(drug: IDrag): void {
        let _drug = { ...drug, uuid: uuid() };
        if (!_drug.durations) {
            _drug = {
                ..._drug,
                durations: [
                    {
                        duration_id: null,
                        type: '',
                        duration: null,
                        order: null,
                        locale: 'bn',
                        instruction: '',
                        frequency: '',
                    },
                ],
            };
        }
        drugs.value = [...drugs.value, _drug];
    }

    function deleteDrug(index: number): void {
        drugs.value = drugs.value.filter((_, i) => i !== index);
    }

    function addMoreDurationItem(drugIndex: number): void {
        const drug = drugs.value[drugIndex];
        if (!drug.durations) drug.durations = [];
        const item = {
            duration_id: null,
            type: 'day',
            duration: null,
            instruction: '',
            frequency: '',
        };
        drug?.durations.push(item);
    }

    function removeDrugDuration(drugIndex: number, durationIndex: number): void {
        const drug = drugs.value[drugIndex];
        drug.durations = drug.durations?.filter((_, i) => i !== durationIndex);
    }

    function isAlreadySelected(drug: IDrag): boolean {
        return getOnlySelectedDrugsIds.value.includes(generateDrugUniqName(drug));
    }

    function setSavingDrugsStatus(status: boolean) {
        isSavingDrugs.value = status;
    }

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
    const toast = useToast();

    const syncWithServer = async () => {
        try {
            status.value.drug.status = 'pending';

            setSavingDrugsStatus(true);

            const payload = getPayload('drugs', drugs.value);

            const isPrescriptionTemplateEditMode =
                prescriptionTemplateStore.isPrescriptionTemplateEditMode &&
                prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            if (isPrescriptionTemplateEditMode) {
                payload.prescription_ref = prescriptionTemplateStore.currentPrescriptionTemplate?.prescription_ref;
            }

            const response = await $api.drug.createForMulti(payload);

            if (response.data) {
                updateServerData(response?.data as IDrag[]);
            }

            savingStatusStore.changeStatusSuccess('drug');
        } catch (error) {
            console.log(error);
            status.value.drug.status = 'failed';
            toast.add({ title: 'Your internet connection is slow</br>Some changes could not be saved', color: 'red' });
        } finally {
            setSavingDrugsStatus(false);
            // status.value.drug.status = null;
        }
    };

    function updateServerData(_drugs: IDrag[]) {
        drugs.value = [
            ..._drugs.map((drug) => {
                const _drug = {
                    prescription_ref: drug.prescription_ref,
                    pivot_ref: drug.ref,
                    instructions: drug.instructions,
                    custom_drug_id: drug.custom_drug_id,
                    is_custom_drug: drug.is_custom_drug,
                    brand_name: drug.brand_name,
                    name: generateDrugUniqName(drug),
                    drug_ref: drug.drug_ref,
                    comment: drug.comment,
                    dosage_form_ref: drug.dosage_form_ref,
                    strength: drug.strength,
                    dosage_form: drug.dosage_form,
                    generic_name: drug.generic_name,
                    generic_ref: drug.generic_ref,
                    drug_id: drug.drug_id,
                    uuid: uuid(),
                };

                if (!drug.is_custom_drug) {
                    _drug.ref = drug.drug_ref;
                }

                if (drug.durations.length > 0) {
                    _drug.durations = [...drug.durations].map((item) => {
                        const _item = { ...item };
                        delete _item.duration_id;
                        return _item;
                    });
                } else {
                    _drug.durations = [
                        {
                            duration_id: null,
                            type: 'days',
                            duration: null,
                            instruction: '',
                            frequency: '',
                        },
                    ];
                }

                return _drug;
            }),
        ];
    }

    function removeDrugFromPrescription(uuid: string) {
        const drug = drugs.value.find((item) => item.uuid === uuid);

        if (!drug) return;

        drugs.value = drugs.value.filter((_drug: any) => _drug.uuid !== drug.uuid);

        if (!drug.ref) return;

        $api.drug.delete(
            getPayload(undefined, {
                prescription_ref: drug.prescription_ref,
                ref: drug.pivot_ref,
            }),
        );
    }

    async function fetchMostUsedDrugs() {
        const response = await $api.drug.mostUsedDrugs();
        mostUsedDrugs.value = response.data || [];
    }

    function $reset() {
        drugs.value = [];
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
                item_ids: currentGroup.items,
            });
        } else {
            prescriptionGroupStore.updateGroup({
                id: currentGroup.id,
                name: currentGroup.name,
                item_identical_name: identicalName,
                item_ids: currentGroup.items,
            });
        }

        cancelGroupMode();
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
        currentGroup.items = group.group_item.map((item) => item.id);
    }

    return {
        // states
        mostUsedDrugs,
        isSavingDrugs,

        // getters
        isShowingDrugEditor,
        drugs,
        dosageFormsList,
        isGroupMode,
        currentGroup,
        identicalName,
        selectedListIndexToFocus,
        isEnterClickedOnDurationInput,

        // actions
        searchDrug,
        syncWithServer,
        fetchDosageForms,
        searchGenerics,
        updateDrug,
        updateServerData,
        updateDrugDuration,
        addMoreDrug,
        deleteDrug,
        addMoreDurationItem,
        removeDrugDuration,
        isAlreadySelected,
        removeDrugFromPrescription,
        cancelGroupMode,
        saveGroup,
        editGroup,
        fetchMostUsedDrugs,
        $reset,
    };
});
