import { defineStore } from 'pinia';

export const useEhrMedicationStore = defineStore('use-medication-store', () => {
    const medicationSelectList: Ref<Object | []> = ref([]);
    const medicationSelectedList: Ref<Object | []> = ref([]);

    const { $api } = useNuxtApp();
    const toast = useToast();

    const updateMedication = async (drug: Object) => {
        try {
            const payload = {
                type: 'brand',
                ref: drug.ref,
                drug_ref: drug.drug_ref ? drug.drug_ref : '',
                strength: drug.strength ? drug.strength : '',
                frequency: drug.frequency ? drug.frequency : null,
                duration_type: drug.duration_type ? drug.duration_type.toLocaleLowerCase() : 'days',
                duration: drug.duration ? drug.duration : '',
            };
            const response = await $api.pastDrug.update(getPayload(undefined, payload));

            if (response) {
                const hasIndex = medicationSelectedList.value.findIndex(
                    (item) => item.drug_ref === response.data.drug_ref,
                );
                medicationSelectedList.value.splice(hasIndex, 1, response.data);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const removedMedication = (drug: Object) => {
        medicationSelectList.value.splice(hasIndex(drug.uuid), 1);
    };

    const removedMedicationForPrescription = async (drug: Object) => {
        medicationSelectedList.value.splice(
            medicationSelectedList.value.findIndex((item) => item.ref === drug.ref),
            1,
        );
        try {
            await $api.pastDrug.delete(getPayload(undefined, unref(drug)));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const setMedicationSelectedData = (data: []) => {
        medicationSelectedList.value = data;
    };

    const hasIndex = (key: any) => {
        return medicationSelectList.value.findIndex((medicationItem) => medicationItem.uuid === key);
    };

    return {
        medicationSelectedList,
        setMedicationSelectedData,
        removedMedication,
        medicationSelectList,
        updateMedication,
        removedMedicationForPrescription,
    };
});
