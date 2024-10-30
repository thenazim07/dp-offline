import { defineStore } from 'pinia';
export const usePrescriptionDrugFrequenciesStore = defineStore('prescription-drug-frequencies', () => {
    const { $api } = useNuxtApp();

    const initialized: Ref<Boolean | false> = ref(false);
    const frequenciesList: Ref<Array<any>> = ref([]);

    async function getFrequencies() {
        // if (initialized.value) return;

        try {
            initialized.value = true;
            const response = await $api.frequencies.get();
            if (response && response.data) {
                frequenciesList.value = response.data;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('prescription-drug-frequencies', error);
        }
    }

    async function getFrequenciesWithSearchKey(search_key: any, drug_ref: any, dosage_form_ref: any) {
        try {
            initialized.value = true;
            const response = await $api.frequencies.getFrequenciesBySearchKey(search_key, drug_ref, dosage_form_ref);
            if (response && response.data) {
                frequenciesList.value = response.data;

                return frequenciesList.value.length > 0 ? frequenciesList.value : [];
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('prescription-drug-frequencies', error);
        }
    }

    return {
        frequenciesList,
        getFrequencies,
        getFrequenciesWithSearchKey,
    };
});
