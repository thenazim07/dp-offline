<script lang="ts" setup>
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';

import { useEhrDiseaseStore } from '~/stores/ehr/disease';
const preset = usePrescriptionPresetStore();
const { presetForIcdCode } = storeToRefs(preset);
const emit = defineEmits(['selected-item']);
const useDisease = useEhrDiseaseStore();
const { diseaseSelectList } = storeToRefs(useDisease);

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
        :selected-list="diseaseSelectList"
        :preset-list="list"
        @selected-item="(value: any) => emit('selected-item', value)"
    >
        <slot />
    </PrescriptionBaseComponentsSuggestionSections>
</template>
