import { v4 as uuid } from 'uuid';
import type { IdenticalName } from '~/repository/modules/ConfigModule/types';
import type { IPrescriptionPreferences } from '~/repository/modules/Prescription/FinishedPrescription/types';
import type { IMostUsedObservation } from '~/repository/modules/Prescription/ObservationModule/types';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionSavingStatusStore } from '../usePrescriptionSavingStatusStore';

export interface IObservation {
    uuid?: string;
    prescription_ref?: string;
    ref?: string;
    observation_id?: number;
    name: string;
    detail?: null;
}

export const useOnExaminationStoreRoot = defineStore('useOnExaminationStoreRoot', () => {
    const { $api } = useNuxtApp();
    const identicalName: IdenticalName = 'observation';
    const prescriptionGroupStore = usePrescriptionGroupStore();
    const isShowingOnExaminationEditor = ref(false);
    const generalExamination = ref(emptyGeneralExamination());
    const observations = ref<IObservation[]>([emptyObservation()]);
    const mostUsedObservations = ref<IMostUsedObservation[]>([]);
    const isGroupMode = ref(false);
    const selectedObservationListIndexToFocus = ref<number | null>(null);
    const currentTabIndex = ref<number | undefined>(0);
    const observationSearchList = ref<{ id: any; name: string }[]>([]);

    const savingStatusStore = usePrescriptionSavingStatusStore();
    const { status } = storeToRefs(savingStatusStore);
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

    const searchObservation = async (query: string) => {
        const response = await $api.observation.get(`?search_key=${query}`);
        const formattedResponse = jsonFormate(response.data, 'name');
        observationSearchList.value = formattedResponse;
        return formattedResponse;
    };

    const getAvailableObservations = computed(() => {
        return observations.value.slice(0, -1);
    });

    const getOnlyObservationNames = computed(() => getAvailableObservations.value.map((indication) => indication.name));

    function updateObservation<T extends keyof IObservation>(index: number, key: T, value: IObservation[T]) {
        // chiefComplaints.value[index][key] = value;
        // chiefComplaints.value[index] = { ...currentIndication, [key]: value };
        observations.value.splice(index, 1, {
            ...observations.value[index],
            [key]: value,
        });

        if (index === observations.value.length - 1) {
            addNewBlankIndication();
        }
    }

    function addNewBlankIndication() {
        observations.value.push(emptyObservation());
    }

    function addNewObservation<T extends keyof IObservation>(data?: Record<T, IObservation[T]>) {
        const index = observations.value.length === 0 ? 0 : observations.value.length - 1;
        observations.value = [
            ...observations.value.slice(0, index),
            emptyObservation(data),
            ...observations.value.slice(index),
        ];
    }

    function emptyGeneralExamination() {
        return {
            vitals: {
                bp: {
                    systolic: '',
                    diastolic: '',
                    from_left_hand: 1,
                },
                bpm: '',
                temp_as_fahrenheit: '',
                SPO2: '',
                A1C: '',
                extra_cal: '',
                target_daily_cal: '',
            },
            patient_data: {
                weight: '',
                height_in_feet: '',
                height_in_inch: '',
                ideal_weight: '',
                ideal_bmi: '',
            },
            prescription_preferences: {
                weight: false,
                height: false,
                bmi: false,
                bsi: false,
            },
        };
    }

    function emptyObservation<T extends keyof IObservation>(data?: Record<T, IObservation[T]>): IObservation {
        const defaultIndication: IObservation = {
            uuid: uuid(),
            prescription_ref: '',
            ref: '',
            observation_id: undefined,
            name: '',
            detail: null,
        };

        return {
            ...defaultIndication,
            ...data,
        };
    }

    async function deleteObservationFromList(uuid?: string) {
        const _observation = observations.value.find((_observation) => _observation.uuid === uuid);
        observations.value = observations.value.filter((_observation) => _observation.uuid !== uuid);

        if (_observation) {
            await $api.observation.delete(getPayload(undefined, _observation));
        }
    }

    function deleteObservation(index: number) {
        observations.value = observations.value.filter((_, i) => i !== index);
    }

    function isAlreadySelected(name: string): boolean {
        return getOnlyObservationNames.value.includes(name);
    }

    async function syncWithServer() {
        try {
            status.value.on_examination_observation.status = 'pending';

            const prescriptionInfo = usePrescriptionInitializedInfo();
            const observationsResponse = await $api.observation.createForMulti({
                prescription_ref: prescriptionInfo?.prescription_ref,
                observations: useRemoveObjectWithEmptyProperty(observations.value.slice(0, -1), 'name'),
            });
            console.log(' observationsResponse ', observationsResponse.data);
            updateServerData(observationsResponse.data as IObservation[]);

            savingStatusStore.changeStatusSuccess('on_examination_observation');
        } catch (e) {
            // console.log('indication error',e);
            status.value.on_examination_observation.status = 'failed';
            toast.add({ title: 'Your internet connection is slow</br>Some changes could not be saved', color: 'red' });
        } finally {
            // status.value.on_examination_observation.loading = false;
        }
    }

    async function syncGeneralExaminationWithServer() {
        try {
            status.value.on_examination_general_examination.status = 'pending';

            let response = await $api.vitals.create(getPayload(undefined, generalExamination.value));

            updateGeneralExaminationPatientDataServerData(response.data.patient_data);

            savingStatusStore.changeStatusSuccess('on_examination_general_examination');
        } catch (e) {
            // console.log('indication error',e);
            status.value.on_examination_general_examination.status = 'failed';
            toast.add({ title: 'Your internet connection is slow</br>Some changes could not be saved', color: 'red' });
        } finally {
            // status.value.on_examination_general_examination.loading = false;
        }
    }

    function updateServerData(_observations: IObservation[]) {
        observations.value = [
            ..._observations.map((observation) => ({ ...observation, uuid: uuid() })),
            emptyObservation(),
        ];
    }

    function updateGeneralExaminationServerData(vitals: object[]) {
        vitals.forEach((vital) => {
            switch (vital.type) {
                case 'heart_rate':
                    generalExamination.value.vitals.bp.diastolic = vital?.BP?.diastolic;
                    generalExamination.value.vitals.bp.systolic = vital?.BP?.systolic;
                    generalExamination.value.vitals.bp.from_left_hand = vital?.BP?.from_left_hand ?? 1;
                    break;
                case 'BPM':
                    generalExamination.value.vitals.bpm = vital?.BPM?.value;
                    break;
                case 'temperature_in_fahrenheit':
                    generalExamination.value.vitals.temp_as_fahrenheit = vital?.value;
                    break;
                case 'SPO2':
                    generalExamination.value.vitals.SPO2 = vital?.value;
                    break;
                case 'A1C':
                    generalExamination.value.vitals.A1C = vital?.value;
                    break;
                case 'extra_cal':
                    generalExamination.value.vitals.extra_cal = vital?.value;
                    break;
                case 'target_daily_cal':
                    generalExamination.value.vitals.target_daily_cal = vital?.value;
                    break;
            }
        });
    }

    function updateGeneralExaminationPrescriptionPreferencesServerData(
        prescription_preferences: IPrescriptionPreferences,
    ) {
        generalExamination.value.prescription_preferences.bmi = prescription_preferences.bmi;
        generalExamination.value.prescription_preferences.bsi = prescription_preferences.bsi;
        generalExamination.value.prescription_preferences.height = prescription_preferences.height;
        generalExamination.value.prescription_preferences.weight = prescription_preferences.weight;
    }

    function updateGeneralExaminationPatientDataServerData(patient_data: object) {
        generalExamination.value.patient_data.height_in_feet = Math.floor(patient_data?.height_inch / 12) || '';
        generalExamination.value.patient_data.height_in_inch = patient_data?.height_inch % 12 || '';
        generalExamination.value.patient_data.weight = patient_data?.weight_kg || '';
        generalExamination.value.patient_data.ideal_bmi = patient_data?.ideal_bmi || '';
        generalExamination.value.patient_data.ideal_weight = patient_data?.ideal_weight || '';
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
            addNewObservation({ name: item.name });
        });
    }

    async function fetchMostUsedObservations(): Promise<void> {
        const response = await $api.observation.mostUsedObservations();

        mostUsedObservations.value = response.data!;
    }

    function $reset() {
        isShowingOnExaminationEditor.value = false;
        generalExamination.value = emptyGeneralExamination();
        observations.value = [emptyObservation()];
        resetCurrentGroup();
    }

    return {
        // state
        generalExamination,
        observations,
        isShowingOnExaminationEditor,
        isGroupMode,
        currentGroup,
        mostUsedObservations,
        selectedObservationListIndexToFocus,
        currentTabIndex,
        observationSearchList,

        // getters
        getAvailableObservations,
        getOnlyObservationNames,

        // actions
        syncGeneralExaminationWithServer,
        searchObservation,
        addNewBlankIndication,
        addNewObservation,
        updateObservation,
        deleteObservationFromList,
        isAlreadySelected,
        syncWithServer,
        updateServerData,
        saveGroup,
        editGroup,
        cancelGroupMode,
        updateGeneralExaminationServerData,
        deleteObservation,
        updateGeneralExaminationPrescriptionPreferencesServerData,
        updateGeneralExaminationPatientDataServerData,
        fetchMostUsedObservations,
        $reset,
    };
});
