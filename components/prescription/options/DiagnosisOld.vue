<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useDiagnosisStore } from '~/stores/prescription/useDiagnosisStore';
const useDiagnosis = useDiagnosisStore();
const { hasSelectedPatient } = managePrescription();
const { isOpen } = storeToRefs(useDiagnosis);
const { modalToggle } = useDiagnosis;
onUnmounted(() => {
    useDiagnosis.$dispose();
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
            Diagnosis
        </LibButtonsPrescriptionFeatureButton>
        <PrescriptionDiagnosisLeftSideComponentList></PrescriptionDiagnosisLeftSideComponentList>
    </div>

    <LazyPrescriptionBaseComponentsModal
        :show="isOpen"
        :closeable="false"
    >
        <PrescriptionBaseComponentsModalHeader
            title="Add Diagnosis "
            @modal:close="modalToggle(false)"
        />
        <LibModalBody>
            <template #left-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionDiagnosisLeftSideComponent />
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
            <template #right-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionDiagnosisRightSideComponent>
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="modalToggle(false)"
                        >
                            Submit
                        </UButton>
                    </LazyPrescriptionDiagnosisRightSideComponent>
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
        </LibModalBody>
    </LazyPrescriptionBaseComponentsModal>
</template>
