import { defineStore } from 'pinia';
import { useChiefComplaintsStoreRoot } from './useChiefComplaintsStoreRoot';
import { useDiagnosisStoreRoot } from './useDiagnosisStoreRoot';
import type { Patient } from '~/types/patient';
import { useHistoryStore } from '~/stores/history/useHistoryStore';
import { useAdviceStore } from '~/stores/prescription/useAdviceStore';
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';
import { useDiagnosisStore } from '~/stores/prescription/useDiagnosisStore';
import { usePrescriptionFollowUpStore } from '~/stores/prescription/followUp';
import { useInvestigationStore } from '~/stores/prescription/useInvestigationStore';
import { useObservationStore } from '~/stores/prescription/useObservationStore';
import { useDoctorVisitsStore } from '~/stores/doctor/visits';
import { usePrescriptionFinishedStore } from '~/stores/prescription/finishedPrescription';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useInvestigationStoreRoot } from './useInvestigationStoreRoot';
import { useAdviceStoreRoot } from './useAdviceStoreRoot';
import { useFollowUpStoreRoot } from './useFollowUpStoreRoot';
import { useOnExaminationStoreRoot } from './useOnExaminationStoreRoot';
import type { IdenticalName } from '~/repository/modules/ConfigModule/types';

//drug-rx
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
import { usePrescriptionDrugFrequenciesStore } from '~/stores/prescription/useDrugStore/frequencies';
import { usePrescriptionDrugInstructionsStore } from '~/stores/prescription/useDrugStore/instructions';

//ehr
import { useEhrDiseaseStoreRoot } from '~/stores/ehr/useDiseaseStoreRoot';
import { useEhrFamilyStoreRoot } from '~/stores/ehr/useFamilyStoreRoot';
import { useEhrLifeStyleStoreRoot } from '~/stores/ehr/useLifeStyleStoreRoot';
import { useEhrInvestigationStoreRoot } from '~/stores/ehr/useInvestigationStoreRoot';
import { useEhrDrugStoreRoot } from '~/stores/ehr/useDrugStoreRoot';
import { useOtherHistoryStoreRoot } from '~/stores/ehr/useOtherHistoryRoot';
import type { IPrescriptionPreferences } from '~/repository/modules/Prescription/FinishedPrescription/types';

export interface Info {
    indications: any;
    diagnoses: object | [];
    drugs: any;
    advice: any;
    observations: any;
    investigations: object | [];
    'follow-up': object | [];
}

export const usePrescriptionStore = defineStore('usePrescriptionStore', () => {
    const prescriptionPresetStore = usePrescriptionPresetStore();
    const prescriptionGroupStore = usePrescriptionGroupStore();
    const prescriptionFinishedStore = usePrescriptionFinishedStore();
    const chiefComplaintsStoreRoot = useChiefComplaintsStoreRoot();
    const diagnosisStoreRoot = useDiagnosisStoreRoot();
    const investigationStoreRoot = useInvestigationStoreRoot();
    const adviceStoreRoot = useAdviceStoreRoot();
    const followUpStoreRoot = useFollowUpStoreRoot();
    const onExaminationStoreRoot = useOnExaminationStoreRoot();

    // drug-rx
    const prescriptionDrugStore = usePrescriptionDrugStore();
    const prescriptionDrugFrequencyStore = usePrescriptionDrugFrequenciesStore();
    const prescriptionDrugInstructionStore = usePrescriptionDrugInstructionsStore();

    //ehr store
    const ehrDiseaseStore = useEhrDiseaseStoreRoot();
    const ehrFamilyStore = useEhrFamilyStoreRoot();
    const ehrLifeStyleStore = useEhrLifeStyleStoreRoot();
    const ehrInvestigationStore = useEhrInvestigationStoreRoot();
    const ehrDrugStore = useEhrDrugStoreRoot();
    const otherHistoryStoreRoot = useOtherHistoryStoreRoot();

    const currentTemplateId: Ref<null | number | string> = ref(null);
    const prescriptionInitializedInfo: Ref<Object | null> = ref({});
    const selectedPatient: Ref<Patient | any> = ref({});
    const { $api } = useNuxtApp();

    async function fetchAndSetPrescriptionServerData() {
        const info = await prescriptionFinishedStore.featchPrescriptionInformation();
        if (!info.prescription) {
            return;
        }

        const { indications, diagnoses, investigations, advice, 'follow-up': followUp } = info.prescription;

        chiefComplaintsStoreRoot.updateServerData(indications);
        diagnosisStoreRoot.updateServerData(diagnoses);
        investigationStoreRoot.updateServerData(investigations);
        adviceStoreRoot.updateServerData(advice);
        followUpStoreRoot.updateServerData(followUp);

        console.log({
            fetchAndSetPrescriptionServerData: 'test',
            info,
        });
    }

    const setPrescriptionInfomation = (info: Info, ehr: any, prescription_preferences?: IPrescriptionPreferences) => {
        const { indications, diagnoses, drugs, advice, observations, investigations, 'follow-up': followUp } = info;

        // Set data from info
        useChiefComplaintsStore().setChiefComplaintsSelectionList(indications);
        useDiagnosisStore().setDiagnosisSelectionList(diagnoses);
        prescriptionDrugStore.updateServerData(drugs);
        useAdviceStore().setAdviceSelectionList(advice);
        useObservationStore().setObservationSelectionList(observations);
        useInvestigationStore().setInvestigationSelectionList(investigations);
        //
        chiefComplaintsStoreRoot.updateServerData(indications);
        diagnosisStoreRoot.updateServerData(diagnoses);
        investigationStoreRoot.updateServerData(investigations);
        adviceStoreRoot.updateServerData(advice);
        onExaminationStoreRoot.updateServerData(observations);

        // Set follow-up data
        if (followUp) {
            usePrescriptionFollowUpStore().setFollowUpData(followUp);
            followUpStoreRoot.updateServerData(followUp);
        }

        // Set ehr data
        if (ehr && ehr?.vitals) {
            useObservationStore().setVitalsFieldData(ehr.vitals);
            onExaminationStoreRoot.updateGeneralExaminationServerData(ehr.vitals);
        }

        if (ehr) {
            // ehr old
            useHistoryStore().setPreSelectedData(ehr);
            // ehr new
            ehrDiseaseStore.updateServerData(ehr.events);
            ehrFamilyStore.updateServerData(ehr.family_histories);
            ehrLifeStyleStore.updateServerData(ehr.life_style);
            ehrInvestigationStore.updateServerData(ehr.investigation_reports || []);
            ehrDrugStore.updateServerData(ehr.past_drug_histories);
            otherHistoryStoreRoot.updateServerData(ehr.surgical_histories);
        }

        if (prescription_preferences) {
            onExaminationStoreRoot.updateGeneralExaminationPrescriptionPreferencesServerData(prescription_preferences);
        }

        if (ehr?.patient) {
            onExaminationStoreRoot.updateGeneralExaminationPatientDataServerData(ehr.patient);
        }
    };

    const setPrescriptionPatientInfo = (value: object) => (selectedPatient.value = value);

    async function fetchPatientInfo(patient_id: any) {
        return await $api.doctorPatient.featchPatientInfo(patient_id);
    }

    const setCookiePrescriptionInformation = (info: any) => {
        const cookies = useCookie('prescription_initialized_info');
        cookies.value = info;
    };

    async function prescriptionInit(user: Patient) {
        resetPrescription();

        setPrescriptionPatientInfo(user);
        useLoading(true);

        try {
            const prescriptionInitPayload = {
                patient_id: user.id,
                revisit_date: null,
            };

            if (currentTemplateId.value) {
                prescriptionInitPayload.template_id = currentTemplateId.value;
            }

            const response = await useDoctorVisitsStore().prescriptionInit(prescriptionInitPayload);

            const patientInfo = await $api.doctorPatient.featchPatientInfo(user.id);

            if (response) {
                setCookiePrescriptionInformation(response);
            }

            if (patientInfo.data) {
                setPrescriptionPatientInfo(patientInfo.data);
            }

            useLoading(false);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error during prescription initialization:', error);
            setPrescriptionPatientInfo({});
            useLoading(false);
        }
    }

    async function prescriptionInitForFollowUp(user: Patient, visit: any) {
        resetPrescription();

        setPrescriptionPatientInfo(user);

        useLoading(true);

        try {
            const response = await useDoctorVisitsStore().prescriptionInit({
                patient_id: visit.patient_id,
                revisit_date: null,
                parent_id: visit.id,
            });

            if (response) {
                setCookiePrescriptionInformation(response);
                usePrescriptionFinishedStore().featchPrescriptionForFollowUpInformation(response?.prescription_ref);
            }

            useLoading(false);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error during prescription initialization:', error);
            setPrescriptionPatientInfo({});
            useLoading(false);
        }
    }

    // reset prescription
    const resetPrescription = async () => {
        const storesToReset = [
            useCookie('prescription_initialized_info'),
            selectedPatient,
            prescriptionInitializedInfo,
        ];

        useHistoryStore().resetAllHistory();
        useChiefComplaintsStore().setChiefComplaintsSelectionList([]);
        useDiagnosisStore().setDiagnosisSelectionList([]);
        useAdviceStore().setAdviceSelectionList([]);
        usePrescriptionFollowUpStore().setFollowUpData([]);
        usePrescriptionFollowUpStore().resetFollowUpData();
        useObservationStore().setObservationSelectionList([]);
        useObservationStore().removeVitals();
        useInvestigationStore().setInvestigationSelectionList([]);
        prescriptionDrugStore.$reset();
        chiefComplaintsStoreRoot.$reset();
        diagnosisStoreRoot.$reset();
        investigationStoreRoot.$reset();
        onExaminationStoreRoot.$reset();
        adviceStoreRoot.$reset();
        followUpStoreRoot.$reset();

        // ehr
        ehrDiseaseStore.$reset(),
            ehrFamilyStore.$reset(),
            ehrLifeStyleStore.$reset(),
            ehrInvestigationStore.$reset(),
            ehrDrugStore.$reset(),
            storesToReset.forEach((store) => (store.value = null));
    };

    const prescriptionCreateInfo = computed(() => prescriptionInitializedInfo.value);
    const hasSelectedPatient = computed<boolean>(() => Boolean(selectedPatient.value?.id));

    const loadPrescriptionConfigsLoaded = ref(false);
    async function loadPrescriptionConfigs() {
        if (loadPrescriptionConfigsLoaded.value) return;
        loadPrescriptionConfigsLoaded.value = true;

        // const identicalNamesForEhr: IdenticalName[] = ['investigation_history', 'life_style_type', 'icd_code'];

        // preset for ehr
        // const presetsEhr = identicalNamesForEhr.map((name) => prescriptionPresetStore.fetchPresetDataForEhr(name));

        await Promise.allSettled([
            // ...presetsEhr,
            // prescriptionDrugStore.fetchDosageForms(),
            // prescriptionDrugFrequencyStore.getFrequencies(),
            // prescriptionDrugInstructionStore.getInstructions(),
            // chiefComplaintsStoreRoot.fetchMostUsedIndications(),
            // diagnosisStoreRoot.fetchMostUsedDiagnosis(),
            // investigationStoreRoot.fetchMostUsedInvestigations(),
            // adviceStoreRoot.fetchMostUsedAdvices(),
            // prescriptionDrugStore.fetchMostUsedDrugs(),
            // otherHistoryStoreRoot.fetchSurgicalType(),
            // ehrDiseaseStore.fetchMostUsedDisease(),
            // ehrFamilyStore.fetchMostUsedFamilyHistory(),
            // ehrLifeStyleStore.fetchMostUsedLifeStyle(),
        ]);
    }

    return {
        currentTemplateId,
        prescriptionInitializedInfo,
        prescriptionCreateInfo,
        hasSelectedPatient,
        selectedPatient,
        setPrescriptionPatientInfo,
        setPrescriptionInfomation,
        prescriptionInit,
        prescriptionInitForFollowUp,
        resetPrescription,

        // actions
        loadPrescriptionConfigs,
        fetchAndSetPrescriptionServerData,
        setCookiePrescriptionInformation,
        fetchPatientInfo,
    };
});
