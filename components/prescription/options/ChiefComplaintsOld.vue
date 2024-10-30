<script lang="ts" setup>
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';

const chiefComplaintsStore = useChiefComplaintsStore();
const { modalToggle } = chiefComplaintsStore;
const { isOpen } = storeToRefs(chiefComplaintsStore);
const toast = useToast();
const { hasSelectedPatient } = managePrescription();

const alertMessage = (): void => {
    if (!hasSelectedPatient.value) {
        toast.add({ title: 'Please select a patient before proceeding', color: 'rose' });
        return;
    }
    modalToggle(true);
};

onUnmounted(() => {
    chiefComplaintsStore.$dispose();
});
</script>

<template>
    <div class="pb-3">
        <LibButtonsPrescriptionFeatureButton
            :is-disabled="!hasSelectedPatient"
            @click="alertMessage"
        >
            Chief Complaints
        </LibButtonsPrescriptionFeatureButton>
        <PrescriptionChiefComplaintsLeftSideComponentList />
    </div>

    <LazyPrescriptionBaseComponentsModal
        :show="isOpen"
        :closeable="false"
    >
        <PrescriptionBaseComponentsModalHeader
            title="Add Chief Complaints"
            @modal:close="modalToggle(false)"
        />

        <LibModalBody>
            <template #left-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionChiefComplaintsLeftSideComponent />
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>

            <template #right-side-content>
                <NuxtErrorBoundary>
                    <LazyPrescriptionChiefComplaintsRightSideComponent>
                        <UButton
                            color="blue"
                            size="lg"
                            block
                            @click="modalToggle(false)"
                        >
                            Submit
                        </UButton>
                    </LazyPrescriptionChiefComplaintsRightSideComponent>
                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </template>
        </LibModalBody>
    </LazyPrescriptionBaseComponentsModal>
</template>
