<script lang="ts" setup>
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
import { useEhrInvestigationHistoryStore } from '~/stores/ehr/investigations';
const preset = usePrescriptionPresetStore();
const { presetForInvestigationHistory } = storeToRefs(preset);
const emit = defineEmits(['selected-item']);
const useInvestigation = useEhrInvestigationHistoryStore();
const { investigationSelectList } = storeToRefs(useInvestigation);

const list = computed(() => {
    if (presetForInvestigationHistory.value.data) {
        return presetForInvestigationHistory.value.data.map((item: Object) => {
            return {
                ...item,
                uuid: getUuid(item.name),
            };
        });
    }
    return [];
});
</script>

<template>
    <PrescriptionBaseComponentsSuggestionSections
        :selected-list="investigationSelectList"
        :preset-list="list"
        @selected-item="(value: any) => emit('selected-item', value)"
    >
        <slot />
    </PrescriptionBaseComponentsSuggestionSections>
</template>
