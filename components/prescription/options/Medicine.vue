<script lang="ts" setup>
import { usePrescriptionDrugStore } from '~/stores/prescription/drug/index';
const usePrescriptionDrug = usePrescriptionDrugStore();
const { hasSelectedPatient } = managePrescription();
const { isOpen } = storeToRefs(usePrescriptionDrug);
const { modalToggle } = usePrescriptionDrug;
onUnmounted(() => {
    usePrescriptionDrug.$dispose();
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
    <div class="mb-44 pb-3">
        <LibButtonsPrescriptionFeatureButton
            :is-disabled="!hasSelectedPatient"
            class="mb-5"
            @click="alertMessage"
        >
            <span>
                <svg
                    class="h-12 w-12"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 34.467 44"
                >
                    <path
                        d="M20.858 32.664c-2.915-3.2-5.79-6.354-8.656-9.514-.73-.806-1.4-1.661-2.149-2.45-1.73-.032-3.454-.019-5.3-.019v9.356a2.435 2.435 0 0 1-1.361 2.437 2.36 2.36 0 0 1-3.388-2.07c-.013-.173-.006-.349-.006-.522V2.722A2.727 2.727 0 0 1 2.735.007c2.527 0 5.051-.021 7.576.006A10.06 10.06 0 0 1 17.958 3.5a10.259 10.259 0 0 1 2.263 9.352 10.7 10.7 0 0 1-4.616 6.32c-.1.064-.2.133-.326.222l8.718 9.7c.489-.53.936-1.013 1.378-1.5 1.61-1.764 3.242-3.511 4.817-5.3a2.43 2.43 0 0 1 1.623-.99 2.261 2.261 0 0 1 2.385 1.39 2.314 2.314 0 0 1-.363 2.653c-1.5 1.674-3.04 3.325-4.545 5-.683.761-1.327 1.559-2.027 2.386v.028c2.065 2.268 4.143 4.524 6.193 6.805a2.9 2.9 0 0 1 .938 2.176 2.262 2.262 0 0 1-1.524 2.082 2.243 2.243 0 0 1-2.606-.631c-1.269-1.388-2.495-2.812-3.748-4.21-.814-.909-1.644-1.8-2.525-2.767-1.133 1.294-2.215 2.555-3.323 3.793-1.037 1.157-2.057 2.333-3.166 3.417a2.283 2.283 0 0 1-3.089-.051 2.343 2.343 0 0 1-.406-3.017 9.521 9.521 0 0 1 .884-1.144c1.959-2.163 3.923-4.309 5.965-6.55ZM4.791 15.922c.2.011.371.024.543.024 1.614 0 3.229.032 4.843 0a5.28 5.28 0 0 0 5.073-3.25 5.477 5.477 0 0 0-4.97-7.825c-1.672-.019-3.345 0-5.019 0-.148 0-.3.024-.47.038Z"
                        data-name="Path 26399"
                    />
                </svg>
            </span>
        </LibButtonsPrescriptionFeatureButton>

        <LazyPrescriptionMedicineLeftSideComponentList />
    </div>

    <LazyPrescriptionBaseComponentsModal
        :show="isOpen"
        :closeable="false"
    >
        <PrescriptionBaseComponentsModalHeader
            title="Add Medicine"
            @modal:close="modalToggle(false)"
        />

        <LibModalBody>
            <template #left-side-content>
                <NuxtErrorBoundary>
                    <PrescriptionMedicineLeftSideComponent />
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
            <template #right-side-content>
                <NuxtErrorBoundary>
                    <PrescriptionMedicineRightSideComponent>
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="modalToggle(false)"
                        >
                            Submit
                        </UButton>
                    </PrescriptionMedicineRightSideComponent>
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
        </LibModalBody>
    </LazyPrescriptionBaseComponentsModal>
</template>
