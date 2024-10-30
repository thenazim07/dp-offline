<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useObservationStore } from '~/stores/prescription/useObservationStore';
const useOnExaminations = useObservationStore();
const { hasSelectedPatient } = managePrescription();
const { isOpen } = storeToRefs(useOnExaminations);
const { modalToggle } = useOnExaminations;
onUnmounted(() => {
    useOnExaminations.$dispose();
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
            On Examination
        </LibButtonsPrescriptionFeatureButton>
        <PrescriptionOnExaminationsLeftSideComponentList></PrescriptionOnExaminationsLeftSideComponentList>
    </div>

    <LazyPrescriptionBaseComponentsModal
        :show="isOpen"
        title="Add On Examinations"
        :closeable="false"
    >
        <PrescriptionBaseComponentsModalHeader
            title="Add On Examinations"
            @modal:close="modalToggle(false)"
        />

        <LibModalBody>
            <template #left-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionOnExaminationsLeftSideComponent />
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
            <template #right-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionOnExaminationsRightSideComponent>
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="modalToggle(false)"
                        >
                            Submit
                        </UButton>
                    </LazyPrescriptionOnExaminationsRightSideComponent>
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
        </LibModalBody>
    </LazyPrescriptionBaseComponentsModal>
</template>
