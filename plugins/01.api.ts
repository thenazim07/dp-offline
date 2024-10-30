import { $fetch, FetchOptions } from 'ofetch';
import type { Extended$Fetch } from '~/repository/factory';
import useDefaultHeaders from '~/composables/useDefaultHeaders';
import AuthModule from '~/repository/modules/auth';
import ConfigsModule from '~/repository/modules/configs';
import PageLayoutModule from '~/repository/modules/PageLayoutModule';
import PatientModule from '~/repository/modules/patients';

import DoctorModule from '~/repository/modules/Doctor';
import DoctorVisitsModule from '~/repository/modules/Doctor/Visits';
import DoctorDiseasesModule from '~/repository/modules/Doctor/Diseases';

import PrescriptionAdviceModule from '~/repository/modules/Prescription/advice';
import PrescriptionModule from '~/repository/modules/Prescription';
import PrescriptionDiagnosisModule from '~/repository/modules/Prescription/diagnosis';
import PrescriptionGroupModule from '~/repository/modules/Prescription/GroupModule';
import PrescriptionIndicationsModule from '~/repository/modules/Prescription/Indications';
import PrescriptionInvestigationsModule from '~/repository/modules/Prescription/Investigations';
import PrescriptionNoteModule from '~/repository/modules/Prescription/note';
import PrescriptionObservationModule from '~/repository/modules/Prescription/observation';
import PrescriptionPresetModule from '~/repository/modules/Prescription/PresetModule';

import PrescriptionDrugsModule from '~/repository/modules/Prescription/DrugsModule';
import PrescriptionDrugsModuleFrequencies from '~/repository/modules/Prescription/DrugsModule/Frequencies';
import PrescriptionDrugsModuleInstructions from '~/repository/modules/Prescription/DrugsModule/Instructions';
import PrescriptionFollowUpModule from '~/repository/modules/Prescription/FollowUpModule';
import PrescriptionFinishedModule from '~/repository/modules/Prescription/FinishedPrescription';
import DoctorPatientModule from '~/repository/modules/Doctor/Patients';

import EhrDiseaseHistoryModule from '~/repository/modules/EHR/DiseaseHistory';
import EhrFamilyHistoryModule from '~/repository/modules/EHR/FamilyHistory';
import EhrInvestigationsHistoryModule from '~/repository/modules/EHR/InvestigationsHistory';
import EhrLifestyleHistoryModule from '~/repository/modules/EHR/LifestyleHistory';
import EhrPastDrugHistoryModule from '~/repository/modules/EHR/PastDrugHistory';
import EhrVitalsModule from '~/repository/modules/EHR/Vitals';
import EhrOtherHistoryModule from '~/repository/modules/EHR/OtherHistory';
import PrescriptionTemplateModule from '~/repository/modules/PrescriptionTemplateModule';

interface IApiInstance {
    auth: AuthModule;
    patient: PatientModule;
    config: ConfigsModule;
    indications: PrescriptionIndicationsModule;
    prescriptionPreset: PrescriptionPresetModule;
    prescriptionGroup: PrescriptionGroupModule;
    pageLayout: PageLayoutModule;
    prescription: PrescriptionModule;
    diagnosis: PrescriptionDiagnosisModule;
    investigation: PrescriptionInvestigationsModule;
    observation: PrescriptionObservationModule;
    advice: PrescriptionAdviceModule;
    note: PrescriptionNoteModule;
    doctor: DoctorModule;
    doctorDiseases: DoctorDiseasesModule;
    doctorVisit: DoctorVisitsModule;

    drug: PrescriptionDrugsModule;
    frequencies: PrescriptionDrugsModuleFrequencies;
    instructions: PrescriptionDrugsModuleInstructions;
    followUp: PrescriptionFollowUpModule;
    finished: PrescriptionFinishedModule;
    doctorPatient: DoctorPatientModule;

    // ehr
    disease: EhrDiseaseHistoryModule;
    family: EhrFamilyHistoryModule;
    investigationHistory: EhrInvestigationsHistoryModule;
    lifeStyle: EhrLifestyleHistoryModule;
    pastDrug: EhrPastDrugHistoryModule;
    vitals: EhrVitalsModule;
    other: EhrOtherHistoryModule;

    // prescription template
    prescriptionTemplate: PrescriptionTemplateModule;
}

export default defineNuxtPlugin(async (nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const apiBaseUrl = runtimeConfig.public.baseURL;

    const fetchOptions: FetchOptions = {
        baseURL: `${apiBaseUrl}`,
    };

    const apiFetcher = $fetch.create(fetchOptions) as Extended$Fetch;
    apiFetcher.defaultHeaders = await useDefaultHeaders(nuxtApp);

    const modules: IApiInstance = {
        auth: new AuthModule(apiFetcher),
        patient: new PatientModule(apiFetcher),
        config: new ConfigsModule(apiFetcher),
        prescription: new PrescriptionModule(apiFetcher),
        indications: new PrescriptionIndicationsModule(apiFetcher),
        prescriptionPreset: new PrescriptionPresetModule(apiFetcher),
        prescriptionGroup: new PrescriptionGroupModule(apiFetcher),
        pageLayout: new PageLayoutModule(apiFetcher),
        diagnosis: new PrescriptionDiagnosisModule(apiFetcher),
        investigation: new PrescriptionInvestigationsModule(apiFetcher),
        observation: new PrescriptionObservationModule(apiFetcher),
        advice: new PrescriptionAdviceModule(apiFetcher),
        note: new PrescriptionNoteModule(apiFetcher),
        doctorDiseases: new DoctorDiseasesModule(apiFetcher),
        doctorVisit: new DoctorVisitsModule(apiFetcher),
        doctor: new DoctorModule(apiFetcher),

        followUp: new PrescriptionFollowUpModule(apiFetcher),
        drug: new PrescriptionDrugsModule(apiFetcher),
        frequencies: new PrescriptionDrugsModuleFrequencies(apiFetcher),
        instructions: new PrescriptionDrugsModuleInstructions(apiFetcher),
        finished: new PrescriptionFinishedModule(apiFetcher),
        doctorPatient: new DoctorPatientModule(apiFetcher),

        // ehr
        disease: new EhrDiseaseHistoryModule(apiFetcher),
        family: new EhrFamilyHistoryModule(apiFetcher),
        investigationHistory: new EhrInvestigationsHistoryModule(apiFetcher),
        lifeStyle: new EhrLifestyleHistoryModule(apiFetcher),
        pastDrug: new EhrPastDrugHistoryModule(apiFetcher),
        vitals: new EhrVitalsModule(apiFetcher),
        other: new EhrOtherHistoryModule(apiFetcher),

        // prescription template
        prescriptionTemplate: new PrescriptionTemplateModule(apiFetcher),
    };

    return {
        provide: {
            api: modules,
        },
    };
});
