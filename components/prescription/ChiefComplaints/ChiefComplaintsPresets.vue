<script setup lang="ts">
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';

const prescriptionPresetStore = usePrescriptionPresetStore();
const chiefComplaintsStore = useChiefComplaintsStore();
const { selectedItems } = storeToRefs(chiefComplaintsStore);

const presetList = computed(() => prescriptionPresetStore.chiefComplaintsPresets.data || []);
const list = computed(() => selectedItems.value ?? []);
</script>

<template>
    <PrescriptionBaseComponentsSuggestionSections
        :selected-list="list"
        :preset-list="presetList"
    >
        <slot></slot>
    </PrescriptionBaseComponentsSuggestionSections>
</template>
