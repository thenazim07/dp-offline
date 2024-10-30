<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useInvestigationStore } from '~/stores/prescription/useInvestigationStore';
const useInvestigation = useInvestigationStore();
const { hasSelectedPatient } = managePrescription();
const { isOpen } = storeToRefs(useInvestigation);
const { modalToggle } = useInvestigation;
onUnmounted(() => {
    useInvestigation.$dispose();
});

const toast = useToast();

const alertMessage = (e: Event): boolean => {
    if (!hasSelectedPatient.value) {
        toast.add({ title: 'Please select a patient before proceeding', color: 'rose' });
        return false;
    }
    // If a patient is selected, toggle the modal
    modalToggle(e);
    return true;
};
</script>

<template>
    <div class="pb-3">
        <LibButtonsPrescriptionFeatureButton
            :is-disabled="!hasSelectedPatient"
            @click="alertMessage"
        >
            Investigation
        </LibButtonsPrescriptionFeatureButton>
        <PrescriptionInvestigationLeftSideComponentList></PrescriptionInvestigationLeftSideComponentList>
    </div>

    <LazyPrescriptionBaseComponentsModal
        :show="isOpen"
        :closeable="false"
    >
        <PrescriptionBaseComponentsModalHeader
            title="Add Investigation"
            @modal:close="modalToggle(false)"
        />

        <LibModalBody>
            <template #left-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionInvestigationLeftSideComponent />
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
            <template #right-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionInvestigationRightSideComponent>
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="modalToggle(false)"
                        >
                            Submit
                        </UButton>
                    </LazyPrescriptionInvestigationRightSideComponent>
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
        </LibModalBody>
    </LazyPrescriptionBaseComponentsModal>
</template>
