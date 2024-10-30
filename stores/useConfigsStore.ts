import { defineStore } from 'pinia';

import type { FieldResponse } from '~/repository/modules/ConfigModule/types';

export const useConfigsStore = defineStore('useConfigsStore', () => {
    const { $api } = useNuxtApp();
    const fields = ref<FieldResponse['data']>({} as FieldResponse['data']);
    const legals: Ref<Object | null> = ref({});
    const ePrescriptionConfig: Ref<Object | null> = ref({});
    const loading: Ref<Boolean | false> = ref(false);
    const initialized: Ref<Boolean | false> = ref(false);
    const modalHeight: Ref<number> = ref(0);

    async function initialize() {
        if (initialized.value) return;
        initialized.value = true;

        await fetchConfigFieldsData();
    }

    const fetchConfigFieldsData = async () => {
        try {
            const response = await $api.config.field();
            fields.value = response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching config legals data:', error);
        }
    };

    const fetchConfigLegalsData = async () => {
        try {
            const response = await $api.config.legals();
            legals.value = response.data;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching config fields data:', error);
        }
    };

    // computed Properties
    const genders = computed(() => fields.value?.genders || []);
    const doctorTitles = computed(() => fields.value?.doctor_titles || []);
    const patientTitles = computed(() => fields.value?.patient_titles || []);
    const doctorTypes = computed(() => fields.value?.doctor_types || []);
    const durationTypes = computed(() => fields.value?.e_prescription?.duration_types ?? []);
    const locales = computed(() => fields.value?.e_prescription?.locales ?? []);
    const drugDurationTypes = computed(() => fields.value?.e_prescription?.drug_duration_types ?? []);
    const duration_types_for_follow_up = computed(
        () => fields.value?.e_prescription?.duration_types_for_follow_up ?? [],
    );
    const duration_types_for_drug = computed(() => fields.value?.e_prescription?.duration_types_for_drug ?? []);
    const duration_types_for_indication = computed(
        () => fields.value?.e_prescription?.duration_types_for_indication ?? [],
    );
    const relations = computed(() => fields.value?.ehr?.relations ?? []);
    const positions = computed(() => fields.value?.ehr?.positions ?? ['Top', 'Left', 'Right', 'Bottom']);
    const duration_types_for_past_history_disease = computed(
        () => fields.value?.ehr?.duration_types_for_past_history_disease ?? [],
    );
    const duration_types_for_past_history_lifestyle = computed(
        () => fields.value?.ehr?.duration_types_for_past_history_lifestyle ?? [],
    );
    const duration_types_for_past_history_medication = computed(
        () => fields.value?.ehr?.duration_types_for_past_history_medication ?? [],
    );
    const duration_types_for_past_history_others = computed(
        () => fields.value?.ehr?.duration_types_for_past_history_others ?? [],
    );
    const doseUnits = computed(() => fields.value?.e_prescription?.dose_units);
    const resultUnit = computed(() => fields.value?.e_prescription?.investigation_result_units ?? []);
    const prescription_body_sections = computed(() => fields.value?.prescription_body_sections ?? []);

    const privacyPolicy = computed(() => legals.value?.privacy_policy || null);
    const termsAndConditions = computed(() => legals.value?.['terms&_conditions'] || null);

    const nonGroupHeight = computed(() => modalHeight.value - 260);
    const groupHeight = computed(() => modalHeight.value - 300);

    return {
        initialize,
        fetchConfigLegalsData,
        modalHeight,
        nonGroupHeight,
        groupHeight,
        fields,
        legals,
        ePrescriptionConfig,
        genders,
        doctorTitles,
        patientTitles,
        doctorTypes,
        privacyPolicy,
        termsAndConditions,
        durationTypes,
        drugDurationTypes,
        loading,
        positions,
        relations,
        doseUnits,
        resultUnit,
        prescription_body_sections,
        locales,
        duration_types_for_indication,
        duration_types_for_drug,
        duration_types_for_follow_up,
        duration_types_for_past_history_disease,
        duration_types_for_past_history_lifestyle,
        duration_types_for_past_history_medication,
        duration_types_for_past_history_others,
    };
});
