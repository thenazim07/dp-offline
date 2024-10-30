<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useDiagnosisStore } from '~/stores/prescription/useDiagnosisStore';
const presetStore = usePrescriptionPresetStore();
const { diagnosisPresets } = storeToRefs(presetStore);
const diagnosisStore = useDiagnosisStore();
const { addNewItem } = diagnosisStore;
const { selectedItems } = storeToRefs(diagnosisStore);
const presetList = computed(() => diagnosisPresets.value?.data || []);
</script>

<template>
    <PrescriptionBaseComponentsSuggestionSections
        :selected-list="selectedItems"
        :preset-list="presetList"
        @selected-item="addNewItem"
    >
        <slot></slot>
    </PrescriptionBaseComponentsSuggestionSections>
</template>
