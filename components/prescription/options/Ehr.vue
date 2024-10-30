<script lang="ts" setup>
import { useEhrStore } from '~/stores/ehr/';

const { prescription_body_sections } = storeToRefs(useConfigsStore());
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
const tiltle = computed(
    () =>
        bodySectionFormData.value.body.columns.column0.items.past_history?.label.text ||
        bodySectionFormData.value.body.columns.column1.items.past_history?.label.text,
);

const pastEhrReference = ref(null);
const pastEhrFloating = ref(null);
const { floatingStyles } = useFloatingElement(pastEhrReference, pastEhrFloating);
const { isShowingPastHistoryEditor, selectedListIndexToFocus, currentTabIndex } = storeToRefs(useEhrStore());

const onListClickHandler = (index: number, tabIndex: number) => {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingPastHistoryEditor.value = true;
        selectedListIndexToFocus.value = index;
        currentTabIndex.value = tabIndex;
    }
};

const onDiseaseListClickHandler = (index: number) => {
    onListClickHandler(index, 0);
};

const onDrugListClickHandler = (index: number) => {
    onListClickHandler(index, 1);
};

const onInvestigationListClickHandler = (index: number) => {
    onListClickHandler(index, 2);
};

const onFamilyListClickHandler = (index: number) => {
    onListClickHandler(index, 3);
};

const onLifeStyleListClickHandler = (index: number) => {
    onListClickHandler(index, 4);
};

function openPastHistoryEditor() {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingPastHistoryEditor.value = true;
    }
}
</script>

<template>
    <div
        ref="pastEhrReference"
        class="EhrSectionClass pb-4"
    >
        <div class="inline-block cursor-pointer">
            <PrescriptionCommonPrescriptionSectionTitle
                :title="tiltle || prescription_body_sections.find((x) => x.value == 'past_history')?.name"
                :is-empty-text="tiltle === '' || tiltle === null || tiltle === undefined"
                :active="isShowingPastHistoryEditor"
                @click.prevent="openPastHistoryEditor"
            />
        </div>

        <div>
            <PrescriptionEhrDiseaseListItem @onListClick="onDiseaseListClickHandler" />
            <PrescriptionEhrDrugListItem @onListClick="onDrugListClickHandler" />
            <PrescriptionEhrInvestigationListItem @onListClick="onInvestigationListClickHandler" />
            <PrescriptionEhrFamilyListItem @onListClick="onFamilyListClickHandler" />
            <PrescriptionEhrLifeStyleListItem @onListClick="onLifeStyleListClickHandler" />
        </div>
    </div>

    <div
        v-if="isShowingPastHistoryEditor"
        ref="pastEhrFloating"
        class="z-10 rounded-lg bg-slate-200 p-4"
        :style="floatingStyles"
    >
        <PrescriptionEhrFloatingWindow />
    </div>
</template>
