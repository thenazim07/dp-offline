<script lang="ts" setup>
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';

import { useEhrFamilyStore } from '~/stores/ehr/family';
const preset = usePrescriptionPresetStore();
const { presetForIcdCode } = storeToRefs(preset);
const emit = defineEmits(['selected-item']);
const useFamily = useEhrFamilyStore();
const { familySelectList } = storeToRefs(useFamily);

const list = computed(() => {
    if (presetForIcdCode.value.data) {
        return presetForIcdCode.value.data.map((item: any) => {
            return {
                ...item,
                uuid: getUuid(item.name),
                disease: item.name,
            };
        });
    }
    return [];
});
</script>

<template>
    <PrescriptionBaseComponentsSuggestionSections
        :selected-list="familySelectList"
        :preset-list="list"
        @selected-item="(value: any) => emit('selected-item', value)"
    >
        <slot />
    </PrescriptionBaseComponentsSuggestionSections>
</template>
