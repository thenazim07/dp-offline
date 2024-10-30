<script lang="ts" setup>
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';

const presetStore = usePrescriptionPresetStore();
const chiefComplaintsStore = useChiefComplaintsStore();
const { selectedItems } = storeToRefs(chiefComplaintsStore);

const presetList = computed(() => presetStore.chiefComplaintsPresets.data || []);
const list = computed(() => selectedItems.value ?? []);

const { addNewItem } = chiefComplaintsStore;
</script>

<template>
    <PrescriptionBaseComponentsSuggestionSections
        :selected-list="list"
        :preset-list="presetList"
        @selected-item="addNewItem"
    >
        <slot></slot>
    </PrescriptionBaseComponentsSuggestionSections>
</template>
