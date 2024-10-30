import { defineStore } from 'pinia';
export const usePrescriptionDrugInstructionsStore = defineStore('prescription-drug-instructions', () => {
    const { $api } = useNuxtApp();

    const initialized: Ref<Boolean | false> = ref(false);
    const instructionsList: Ref<Array<any>> = ref([]);

    async function getInstructions() {
        if (initialized.value) return;

        try {
            initialized.value = true;
            const response = await $api.instructions.get();
            if (response && response.data) {
                instructionsList.value = response.data;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('prescription-drug-instructions', error);
        }
    }

    async function getInstructionsBySearchKey(search_key: any, drug_ref: any) {
        try {
            const response = await $api.instructions.getBySerchKey(search_key, drug_ref);
            if (response && response.data) {
                instructionsList.value = response.data;

                return instructionsList.value;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('prescription-drug-instructions', error);
        }
    }

    return {
        instructionsList,
        getInstructions,
        getInstructionsBySearchKey,
    };
});
