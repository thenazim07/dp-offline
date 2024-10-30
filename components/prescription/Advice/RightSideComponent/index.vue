<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useAdviceStore } from '~/stores/prescription/useAdviceStore';
const presetStore = usePrescriptionPresetStore();
const { advicePresets } = storeToRefs(presetStore);
const adviceStore = useAdviceStore();
const { addNewItem } = adviceStore;
const { selectedItems } = storeToRefs(adviceStore);
const presetList = computed(() => advicePresets.value?.data || []);
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
