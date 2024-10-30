import { defineStore } from 'pinia';
import { useEhrDiseaseStore } from '~/stores/ehr/disease';
import { useEhrFamilyStore } from '~/stores/ehr/family';
import { useEhrInvestigationHistoryStore } from '~/stores/ehr/investigations';
import { useEhrLifeStyleStore } from '~/stores/ehr/lifeStyle';
import { useEhrMedicationStore } from '~/stores/ehr/medication';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';

export const useHistoryStore = defineStore('useHistory', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();
    const usePreset = usePrescriptionPresetStore();
    const useDisease = useEhrDiseaseStore();
    const useMedication = useEhrMedicationStore();
    const useInvestigation = useEhrInvestigationHistoryStore();
    const useFamily = useEhrFamilyStore();
    const useLifeStyle = useEhrLifeStyleStore();
    const surgicalType: Ref<Object | null> = ref({});
    const otherData: Ref<Object | null> = ref({
        surgical_histories: {},
    });
    const allergies: Ref<Object | null> = ref({});
    const othersHistoryData: Ref<Object | null> = ref({});
    const initialized: Ref<Boolean | false> = ref(false);
    const selectedTab: Ref<number | string> = ref(0);
    const workingTabIndex = ref(0);
    const isOpenModal: Ref<Boolean | false> = ref(false);
    const errorInfo: Ref<Object | null> = ref({
        disease: null,
    });

    async function initialize() {
        // If the course has already been initialized, return
        if (initialized.value) return;
        initialized.value = true;

        await usePreset.fetchPresetDataForEhr('icd_code');
        await usePreset.fetchPresetDataForEhr('life_style_type');
        await usePreset.fetchPresetDataForEhr('investigation_history');
        await fetchSurgicalType();
        await fetchAllergies();
    }

    const modalToggle = (closeOrOpen: boolean) => {
        selectedTab.value = 0;
        if (!closeOrOpen) {
            // useDisease.createOrUpdateDisease();
            // useInvestigation.createOrUpdateInvestigation();
            // useFamily.createOrUpdateFamily();
            // useMedication.createOrUpdateMedication();
            // useLifeStyle.createOrUpdateLifeStyle();
            // createSurgicalInfo();
            isOpenModal.value = !isOpenModal.value;
        }
        if (closeOrOpen) {
            isOpenModal.value = !isOpenModal.value;
        }
    };

    const isOpen = computed(() => isOpenModal.value || false);

    const setPreSelectedData = (ehr: any) => {
        if (ehr && ehr.events) {
            useDisease.setDiseaseSelectedData(ehr.events);
        }

        if (ehr && ehr.family_histories) {
            useFamily.setFamilySelectedData(ehr.family_histories);
        }

        if (ehr && ehr.past_drug_histories) {
            useMedication.setMedicationSelectedData(ehr.past_drug_histories);
        }

        if (ehr && ehr.life_style) {
            useLifeStyle.setLifeStyleSelectedData(ehr.life_style);
        }

        if (ehr && ehr.investigation_reports) {
            useInvestigation.setInvestgationSelectedData(ehr.investigation_reports);
        }

        // if (ehr && ehr.surgical_histories) {
        //     otherData.value.surgical_histories = ehr.surgical_histories;
        // }
    };

    const resetAllHistory = () => {
        useDisease.setDiseaseSelectedData([]);
        useMedication.setMedicationSelectedData([]);
        useInvestigation.setInvestgationSelectedData([]);
        useFamily.setFamilySelectedData([]);
        useLifeStyle.setLifeStyleSelectedData([]);
    };

    // Other History
    async function fetchSurgicalType() {
        const { data: surgicalData } = await useApiFetch<Object>(`/ehr/surgicals`);
        if (surgicalData.value) {
            surgicalType.value = surgicalData.value.data;
        }
    }

    async function fetchAllergies() {
        const { data: allergiesData } = await useApiFetch<Object>(`/ehr/allergies`);
        if (allergiesData.value) {
            allergies.value = allergiesData.value.data;
        }
    }

    const surgicalsData = ref([]);

    const selectSurgicalInfo = (values: any) => {
        const surgicals = values?.surgicals?.filter((item: any) => item.name && item.duration_type && item.duration);
        surgicalsData.value = surgicals || [];
    };

    const removedSurgicalsForPrescription = async (surgical: Object) => {
        const index = otherData.value.surgical_histories.findIndex((item) => item.ref === surgical.ref);
        otherData.value.surgical_histories.splice(index, 1);

        try {
            await $api.other.deleteSurgicalHistory(getPayload(undefined, surgical));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const immunizedUpdate = async (data: Object) => {
        try {
            const response = await $api.other.updateImmunized(getPayload('is_immunized', Boolean(!data)));
            if (response) {
                othersHistoryData.immunization = response.data.is_immunized;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const periodUpdateOrCreate = async (data: Object) => {
        try {
            const response = await $api.other.createPeriodHistory(getPayload(undefined, data));
            if (response) {
                othersHistoryData.period = response.data;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const workingTab = (index: any) => {
        workingTabIndex.value = index;
    };

    return {
        initialize,
        modalToggle,
        isOpenModal,
        setPreSelectedData,
        resetAllHistory,
        isOpen,
        errorInfo,

        // other
        surgicalType,
        selectedTab,
        workingTab,
        removedSurgicalsForPrescription,
        otherData,
        allergies,
        selectSurgicalInfo,
        immunizedUpdate,
        periodUpdateOrCreate,
    };
});
