<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useObservationStore } from '~/stores/prescription/useObservationStore';
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';
const useOnExaminations = useObservationStore();
const onExaminationStoreRoot = useOnExaminationStoreRoot();
const { hasSelectedPatient } = managePrescription();
const { isShowingOnExaminationEditor, selectedObservationListIndexToFocus, currentTabIndex } =
    storeToRefs(onExaminationStoreRoot);
const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloatingElement(reference, floating);
const { modalToggle } = useOnExaminations;

onUnmounted(() => {
    useOnExaminations.$dispose();
});

const { prescription_body_sections } = storeToRefs(useConfigsStore());
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
const tiltle = computed(
    () =>
        bodySectionFormData.value.body.columns.column0.items.on_examination?.label.text ||
        bodySectionFormData.value.body.columns.column1.items.on_examination?.label.text,
);

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

function onExaminationClickHandler() {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingOnExaminationEditor.value = true;
        currentTabIndex.value = 0;
    }
}

const onObservationListClickHandler = (index: any) => {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingOnExaminationEditor.value = true;
        selectedObservationListIndexToFocus.value = index;
        currentTabIndex.value = 1;
    }
};
</script>

<template>
    <div
        ref="reference"
        class="OnExaminationSectionClass pb-4"
    >
        <div class="inline-block cursor-pointer">
            <PrescriptionCommonPrescriptionSectionTitle
                :title="tiltle || prescription_body_sections.find((x) => x.value == 'on_examination')?.name"
                :is-empty-text="tiltle === '' || tiltle === null || tiltle === undefined"
                :active="isShowingOnExaminationEditor"
                @click.prevent="onExaminationClickHandler"
            />
        </div>

        <PrescriptionOnExaminationsGeneralExaminationList @click.prevent="onExaminationClickHandler" />
        <PrescriptionOnExaminationsObservationList
            class="mt-3"
            @onListClick="onObservationListClickHandler"
        />
    </div>

    <div
        v-if="isShowingOnExaminationEditor"
        ref="floating"
        class="z-10 min-w-[1036px] max-w-[1036px] max-1919:min-w-[1036px] max-1919:max-w-[1036px] max-1599:min-w-[920px] max-1599:max-w-[920px]"
        :style="floatingStyles"
    >
        <PrescriptionOnExaminationsFloatingWindow />
    </div>
</template>
