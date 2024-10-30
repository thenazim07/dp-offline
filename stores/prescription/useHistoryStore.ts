import { defineStore } from 'pinia';

export const useHistoryStore = defineStore('useHistoryStore', () => {
    const { $api } = useNuxtApp();
    const toast = useToast();

    // Disease
    const diseaseSearchResultList: Ref<Object | null> = ref({});
    const diseaseSearchLoading: Ref<Boolean | false> = ref(false);
    const diseaseSelectionList: Ref<Array<any>> = ref([]);

    // Medication
    const medicationSearchResultList: Ref<Object | null> = ref({});
    const medicationSearchLoading: Ref<Boolean | false> = ref(false);
    const medicationSelectionList: Ref<Array<any>> = ref([]);

    // Investigation
    const investigationSearchResultList: Ref<Object | null> = ref({});
    const investigationSearchLoading: Ref<Boolean | false> = ref(false);
    const investigationSelectionList: Ref<Array<any>> = ref([]);

    // Family
    const familySearchResultList: Ref<Object | null> = ref({});
    const familySearchLoading: Ref<Boolean | false> = ref(false);
    const familySelectionList: Ref<Array<any>> = ref([]);

    // LifeStyle
    const lifeStyleSearchResultList: Ref<Object | null> = ref({});
    const lifeStyleSearchLoading: Ref<Boolean | false> = ref(false);
    const lifeStyleSelectionList: Ref<Array<any>> = ref([]);

    // Other
    const surgicalType: Ref<Array<any>> = ref([]);
    const otherData: Ref<Object | null> = reactive({
        immunization: false,
        period: null,
    });

    // Disease
    const searchDisease = async (query: String) => {
        if (query.length === 0) return;
        diseaseSearchLoading.value = true;

        try {
            const response = await $api.disease.icd_code(query);
            if (response) {
                diseaseSearchResultList.value = response.data.map((disease) => {
                    return {
                        ...disease,
                        icd_code_ref: disease.code,
                    };
                });
                diseaseSearchLoading.value = false;
            }
        } catch (error) {
            diseaseSearchLoading.value = false;
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const createOrUpdateDisease = async (data: Object) => {
        try {
            const response = await $api.disease.create(data);
            if (response) {
                const hasIndex = diseaseSelectionList.value.findIndex((disease) => disease.disease === data.disease);
                if (hasIndex === -1) {
                    diseaseSelectionList.value.push(response.data);
                    return true;
                }
                diseaseSelectionList.value.splice(index, 1, response.data);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const deleteDisease = async (data: Object) => {
        const { prescriptionCreateInfo } = managePrescription();
        data.visit_client_ref = prescriptionCreateInfo.value.visit_ref;
        try {
            const response = await $api.disease.delete(data);
            if (response) {
                const index = diseaseSelectionList.value.findIndex(
                    (disease) => disease.icd_code_ref === data.icd_code_ref,
                );
                diseaseSelectionList.value.splice(index, 1);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const setDiseaseSelectedData = (data: []) => {
        diseaseSelectionList.value = data;
    };

    // Medication
    const searchMedication = async (query: String) => {
        medicationSearchLoading.value = true;
        try {
            const response = await $api.drug.get(query);
            if (response) {
                medicationSearchResultList.value = response.data;
                medicationSearchLoading.value = false;
            }
        } catch (error) {
            medicationSearchLoading.value = false;
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const addMedication = async (data: object) => {
        try {
            const response = await $api.pastDrug.createPastDrugHistory(data);
            if (response) {
                diseaseSelectionList.value.push(response.data);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const setSelectedSingleItemForDrug = async (drug: Object) => {
        if (!drug.drug_ref) return;
        try {
            const response = await $api.drug.get(`/drugs/${drug.drug_ref}`);
            if (response) {
                const data = response.data;

                data.type = response.data.brand_name ? 'brand' : 'generic';

                medicationSelectionList.value.push(response.data);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const setDrugSelectedData = (data: []) => {
        medicationSelectionList.value = data;
    };

    const removedDrug = (drugID: Number) => {
        const index = medicationSelectionList.value.findIndex((drug) => drug.drug_id === drugID);
        medicationSelectionList.value.splice(index, 1);
    };

    // Investigation
    const searchInvestigation = async (query: String) => {
        investigationSearchLoading.value = true;
        try {
            const response = await $api.investigationHistory.get(query);
            if (response) {
                investigationSearchResultList.value = response.data.map((investigation) => {
                    return {
                        ...investigation,
                        client_ref: investigation.ref,
                    };
                });
                investigationSearchLoading.value = false;
            }
        } catch (error) {
            investigationSearchLoading.value = false;
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const setSelectedSingleItemForInvestigation = (investigationItem: object) => {
        const index = investigationSelectionList.value.findIndex(
            (investigation) => investigation.client_ref === investigationItem.client_ref,
        );

        if (index === -1) {
            investigationSelectionList.value.push(investigationItem);
            return true;
        }

        investigationSelectionList.value.splice(index, 1, investigationItem);
    };

    const createOrUpdateInvestigation = async (data: Object) => {
        try {
            const response = await $api.investigationHistory.create(data);
            if (response) {
                setSelectedSingleItemForInvestigation(response.data);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const deleteInvestigation = async (data: object) => {
        const { prescriptionCreateInfo } = managePrescription();
        data.visit_client_ref = prescriptionCreateInfo.value.visit_ref;
        data.ref = data.ehr_ref ? data.ehr_ref : data.ref;
        try {
            const response = await $api.investigationHistory.delete(data);
            if (response) {
                investigationSelectionList.value.splice(index, 1);
            }
        } catch (error) {
            investigationSelectionList.value.splice(index, 1);
        }
    };

    const setInvestigationSelectedData = (data: []) => {
        investigationSelectionList.value = data;
    };

    // Family
    const searchFamily = async (query: string) => {
        familySearchLoading.value = true;
        try {
            const response = await $api.family.get(query);
            if (response) {
                familySearchResultList.value = response.data;
                familySearchLoading.value = false;
            }
        } catch (error) {
            familySearchLoading.value = false;
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const createOrUpdateFamily = async (data: Object) => {
        try {
            const response = await $api.family.create(data);
            if (response) {
                const hasIndex = familySelectionList.value.findIndex((family) => family.disease === data.disease);
                if (hasIndex === -1) {
                    familySelectionList.value.push(response.data);
                    return true;
                }
                familySelectionList.value.splice(hasIndex, 1, response.data);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const deleteFamily = async (data: Object) => {
        const { prescriptionCreateInfo } = managePrescription();
        data.visit_client_ref = prescriptionCreateInfo.value.visit_ref;
        try {
            const response = await $api.family.delete(data);
            if (response) {
                const index = familySelectionList.value.findIndex(
                    (family) => family.icd_code_ref === data.icd_code_ref,
                );
                familySelectionList.value.splice(index, 1);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const setFamilySelectedData = (data: []) => {
        familySelectionList.value = data;
    };

    // LifeStyle
    const searchLifeStyle = async (query: String) => {
        lifeStyleSearchLoading.value = true;
        try {
            const response = await $api.lifeStyle.get_life_style(query);
            if (response) {
                lifeStyleSearchResultList.value = response.data;
                lifeStyleSearchLoading.value = false;
            }
        } catch (error) {
            lifeStyleSearchLoading.value = false;
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const createOrUpdateLifeStyle = async (data: Object) => {
        try {
            const response = await $api.lifeStyle.create_life_style(data);
            if (response) {
                lifeStyleSelectionList.value.push(response.data);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const deleteLifeStyle = async (data: Object) => {
        const { prescriptionCreateInfo } = managePrescription();

        data.visit_client_ref = prescriptionCreateInfo.value.visit_ref;
        try {
            const response = await $api.lifeStyle.delete(data);
            if (response) {
                // const index = lifeStyleSelectionList.value.findIndex((lifeStyle) => (lifeStyle.ref = lifeStyle.ref));
                // lifeStyleSelectionList.value.splice(index, 1);
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const setLifeStyleSelectedData = (data: []) => {
        lifeStyleSelectionList.value = data;
    };

    const setSelectedSingleItemForLifeStyle = (lifeStyle: object) => {
        const index = lifeStyleSelectionList.value.findIndex((life_style) => life_style === life_style.ref);

        if (index === -1) {
            lifeStyleSelectionList.value.push(lifeStyle);
            return;
        }
        toast.add({ title: 'Already exists', color: 'red' });
    };

    // Other History
    async function fetchSurgicalType() {
        const { data: surgicalData } = await useApiFetch<Object>(`/ehr/surgicals`);
        if (surgicalData.value) {
            surgicalType.value = surgicalData.value.data;
        }
    }

    const createSurgicalInfo = async (data: object) => {
        try {
            await $api.other.createSurgicalHistory(data);
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const immunizedUpdate = async (data: Object) => {
        try {
            const response = await $api.other.updateImmunized(data);
            if (response) {
                otherData.immunization = response.data.is_immunized;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    const periodUpdateOrCreate = async (data: Object) => {
        try {
            const response = await $api.other.createPeriodHistory(data);
            if (response) {
                otherData.period = response.data;
            }
        } catch (error) {
            toast.add({ title: error?.data?.message, color: 'red' });
        }
    };

    return {
        // Disease
        diseaseSearchLoading,
        diseaseSearchResultList,
        diseaseSelectionList,
        createOrUpdateDisease,
        searchDisease,
        setDiseaseSelectedData,
        deleteDisease,

        // Medication
        searchMedication,
        addMedication,
        medicationSearchLoading,
        medicationSelectionList,
        medicationSearchResultList,
        setSelectedSingleItemForDrug,
        removedDrug,
        setDrugSelectedData,

        // Investigation
        searchInvestigation,
        createOrUpdateInvestigation,
        investigationSearchLoading,
        investigationSelectionList,
        investigationSearchResultList,
        deleteInvestigation,
        setInvestigationSelectedData,
        setSelectedSingleItemForInvestigation,

        // Family
        searchFamily,
        createOrUpdateFamily,
        familySearchLoading,
        familySelectionList,
        familySearchResultList,
        deleteFamily,
        setFamilySelectedData,

        // LifeStyle
        searchLifeStyle,
        createOrUpdateLifeStyle,
        lifeStyleSearchLoading,
        lifeStyleSelectionList,
        lifeStyleSearchResultList,
        deleteLifeStyle,
        setLifeStyleSelectedData,
        setSelectedSingleItemForLifeStyle,

        // Other
        otherData,
        surgicalType,
        fetchSurgicalType,
        createSurgicalInfo,
        immunizedUpdate,
        periodUpdateOrCreate,
    };
});
