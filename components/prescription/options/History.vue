<script lang="ts" setup>
import { useHistoryStore } from '~/stores/history/useHistoryStore';
const useHistory = useHistoryStore();
const { initialize } = useHistory;
const { hasSelectedPatient } = managePrescription();

initialize();

const isOpen = ref(false);
const selectedTab: Ref<number> = ref(0);

const tabs = [
    {
        label: 'Disease',
        key: 'disease',
    },
    {
        label: 'Medication',
        key: 'medication',
    },
    {
        label: 'Investigation',
        key: 'investigation',
    },
    {
        label: 'Family',
        key: 'family',
    },
    {
        label: 'Lifestyle',
        key: 'lifestyle',
    },
    {
        label: 'Others',
        key: 'others',
    },
];

const config = {
    wrapper: 'space-y-0',
    list: {
        base: 'border-t border-b border-l mb-5',
        background: 'bg-white',
        rounded: 'rounded-none',
        padding: 'p-0',
        marker: {
            shadow: 'shadow-none',
        },
        tab: {
            base: 'border-b-2 border-r ui-focus-visible:ring-0 ui-focus-visible:ring-blue-500',
            height: 'h-10',
            inactive: 'border-b-transparent',
            active: 'border-b-blue-600 text-blue-600',
            rounded: 'rounded-none',
        },
    },
};

// disease section
const diseaseRef: Ref<any> = ref(null);
const addNewDisease = (value: any) => {
    diseaseRef?.value?.selectedOrUpdateDisease(value);
};

// medicine section
const medicineRef: Ref<any> = ref(null);
const addNewMedicine = (value: any) => {
    medicineRef?.value?.selectedOrUpdateMedicine(value);
};

// family section
const familyRef: Ref<any> = ref(null);
const addNewFamily = (value: any) => {
    familyRef?.value?.selectedOrUpdateFamily(value);
};

// investigation section
const investigationRef: Ref<any> = ref(null);
const addNewLifeInvestigation = (value: any) => {
    investigationRef?.value?.selectedOrUpdateInvestigation(value);
};

// lifeStyle section
const lifeStyleRef: Ref<any> = ref(null);
const addNewLifeStyle = (value: any) => {
    lifeStyleRef?.value?.selectedOrUpdateLifeStyle({ ...value, value: null, note: value.value });
};

const closeModal = () => {
    isOpen.value = false;
    setTimeout(() => {
        selectedTab.value = 0;
    }, 1000);
};

const toast = useToast();

const alertMessage = (): boolean => {
    if (!hasSelectedPatient.value) {
        toast.add({ title: 'Please select a patient before proceeding', color: 'rose' });
        return false;
    }
    // If a patient is selected, toggle the modal
    isOpen.value = true;
    return true;
};
</script>

<template>
    <div class="pb-3">
        <LibButtonsPrescriptionFeatureButton
            :is-disabled="!hasSelectedPatient"
            @click="alertMessage"
        >
            Past History
        </LibButtonsPrescriptionFeatureButton>

        <PrescriptionHistoryDiseaseItems />
        <PrescriptionHistoryFamilyItems />
        <PrescriptionHistoryLifeStyleItems />
        <PrescriptionHistoryInvestigationItems />
        <PrescriptionHistoryMedicationItems />
        <PrescriptionHistoryOtherItems />
    </div>

    <LazyPrescriptionBaseComponentsModal
        :show="isOpen"
        :closeable="false"
    >
        <PrescriptionBaseComponentsModalHeader
            title="Add Past History"
            @modal:close="closeModal"
        />

        <ClientOnly>
            <LibModalBody>
                <template #left-side-content>
                    <UTabs
                        :items="tabs"
                        :ui="config"
                        :default-index="0"
                        @change="(value) => (selectedTab = value)"
                    >
                        <template #item="{ item }">
                            <PrescriptionHistoryDisease
                                v-if="item.key === 'disease'"
                                ref="diseaseRef"
                            />

                            <PrescriptionHistoryMedication
                                v-if="item.key === 'medication'"
                                ref="medicineRef"
                            />

                            <PrescriptionHistoryInvestigation
                                v-if="item.key === 'investigation'"
                                ref="investigationRef"
                            />

                            <PrescriptionHistoryFamily
                                v-if="item.key === 'family'"
                                ref="familyRef"
                            />

                            <PrescriptionHistoryLifeStyle
                                v-if="item.key === 'lifestyle'"
                                ref="lifeStyleRef"
                            />

                            <PrescriptionHistoryOther v-if="item.key === 'others'" />
                        </template>
                    </UTabs>
                </template>

                <template #right-side-content>
                    <PrescriptionHistoryDiseaseSuggestionSection
                        v-if="selectedTab === 0"
                        @selected-item="addNewDisease"
                    >
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="closeModal"
                        >
                            Submit
                        </UButton>
                    </PrescriptionHistoryDiseaseSuggestionSection>

                    <LazyPrescriptionHistoryMedicationSuggestionSections
                        v-if="selectedTab === 1"
                        @selected-item="addNewMedicine"
                    >
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="closeModal"
                        >
                            Submit
                        </UButton>
                    </LazyPrescriptionHistoryMedicationSuggestionSections>

                    <PrescriptionHistoryInvestigationSuggestionSection
                        v-if="selectedTab === 2"
                        @selected-item="addNewLifeInvestigation"
                    >
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="closeModal"
                        >
                            Submit
                        </UButton>
                    </PrescriptionHistoryInvestigationSuggestionSection>

                    <PrescriptionHistoryFamilySuggestionSection
                        v-if="selectedTab === 3"
                        @selected-item="addNewFamily"
                    >
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="closeModal"
                        >
                            Submit
                        </UButton>
                    </PrescriptionHistoryFamilySuggestionSection>

                    <PrescriptionHistoryLifeStyleSuggestionSection
                        v-if="selectedTab === 4"
                        @selected-item="addNewLifeStyle"
                    >
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="closeModal"
                        >
                            Submit
                        </UButton>
                    </PrescriptionHistoryLifeStyleSuggestionSection>

                    <PrescriptionHistoryOtherSuggestionSection
                        v-if="selectedTab === 5"
                        @selected-item="addNewLifeStyle"
                    >
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="closeModal"
                        >
                            Submit
                        </UButton>
                    </PrescriptionHistoryOtherSuggestionSection>
                </template>
            </LibModalBody>
        </ClientOnly>
    </LazyPrescriptionBaseComponentsModal>
</template>
