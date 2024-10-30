<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useObservationStore } from '~/stores/prescription/useObservationStore';
const presetStore = usePrescriptionPresetStore();
const { observationPresets } = storeToRefs(presetStore);
const observationStore = useObservationStore();
const { addNewItem } = observationStore;
const { selectedItems, activeIndex } = storeToRefs(observationStore);
const presetList = computed(() => observationPresets.value?.data || []);
</script>

<template>
    <PrescriptionBaseComponentsSuggestionSections
        :selected-list="selectedItems"
        :preset-list="activeIndex !== 0 ? presetList : []"
        @selected-item="addNewItem"
    >
        <slot />
    </PrescriptionBaseComponentsSuggestionSections>
</template>
