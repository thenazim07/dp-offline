<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useInvestigationStore } from '~/stores/prescription/useInvestigationStore';
const presetStore = usePrescriptionPresetStore();
const { investigationPresets } = storeToRefs(presetStore);
const investigationStore = useInvestigationStore();
const { addNewItem } = investigationStore;
const { selectedItems } = storeToRefs(investigationStore);
const presetList = computed(() => investigationPresets.value?.data || []);
</script>

<template>
    <PrescriptionBaseComponentsSuggestionSections
        :selected-list="selectedItems"
        :preset-list="presetList"
        @selected-item="addNewItem"
    >
        <slot />
    </PrescriptionBaseComponentsSuggestionSections>
</template>
