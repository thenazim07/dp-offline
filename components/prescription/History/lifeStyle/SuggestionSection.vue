<script lang="ts" setup>
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
import { useEhrLifeStyleStore } from '~/stores/ehr/lifeStyle';
const preset = usePrescriptionPresetStore();
const { presetForLifeStyle } = storeToRefs(preset);
const emit = defineEmits(['selected-item']);
const useLifeStyle = useEhrLifeStyleStore();
const { lifeStyleSelectList } = storeToRefs(useLifeStyle);

const list = computed(() => {
    if (presetForLifeStyle.value.data) {
        return presetForLifeStyle.value.data.map((item: any) => {
            return {
                ...item,
                title: item.name,
                type: item.name,
                life_style_type_id: item.item_id,
            };
        });
    }
    return [];
});
</script>

<template>
    <PrescriptionBaseComponentsSuggestionSections
        :selected-list="lifeStyleSelectList"
        :preset-list="list"
        @selected-item="(value: any) => emit('selected-item', value)"
    >
        <slot></slot>
    </PrescriptionBaseComponentsSuggestionSections>
</template>
