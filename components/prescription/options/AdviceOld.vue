<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAdviceStore } from '~/stores/prescription/useAdviceStore';
const useAdvice = useAdviceStore();
const { hasSelectedPatient } = managePrescription();
const { isOpen } = storeToRefs(useAdvice);
const { modalToggle } = useAdvice;
onUnmounted(() => {
    useAdvice.$dispose();
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
    <div class="mb-10 pb-3">
        <LibButtonsPrescriptionFeatureButton
            :is-disabled="!hasSelectedPatient"
            @click="alertMessage"
        >
            Advice
        </LibButtonsPrescriptionFeatureButton>
        <PrescriptionAdviceLeftSideComponentList></PrescriptionAdviceLeftSideComponentList>
    </div>

    <LazyPrescriptionBaseComponentsModal
        :show="isOpen"
        :closeable="false"
    >
        <PrescriptionBaseComponentsModalHeader
            title="Add Advice"
            @modal:close="modalToggle(false)"
        />

        <LibModalBody>
            <template #left-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionAdviceLeftSideComponent />
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
            <template #right-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionAdviceRightSideComponent>
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="modalToggle(false)"
                        >
                            Submit
                        </UButton>
                    </LazyPrescriptionAdviceRightSideComponent>
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
        </LibModalBody>
    </LazyPrescriptionBaseComponentsModal>
</template>
