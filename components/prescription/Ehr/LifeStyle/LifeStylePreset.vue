<script lang="ts" setup>
import { v4 as uuid } from 'uuid';
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
import { useEhrLifeStyleStoreRoot } from '~/stores/ehr/useLifeStyleStoreRoot';
import type { ILifeStyle } from '~/repository/modules/EHR/LifestyleHistory/types';

const preset = usePrescriptionPresetStore();
const { presetForLifeStyle } = storeToRefs(preset);
const useLifeStyleStoreRoot = useEhrLifeStyleStoreRoot();

const presetList = computed(() => {
    if (presetForLifeStyle?.value?.data) {
        return presetForLifeStyle.value.data.map((item: ILifeStyle) => {
            console.log(item);

            return {
                ...item,
                uuid: uuid(),
                type: item.name,
            };
        });
    }
    return [];
});

const mostUsedLifeStyleList = computed(() => {
    return useLifeStyleStoreRoot.mostUsedLifeStyleList.map((item) => {
        return {
            ...item,
            uuid: uuid(),
            type: item.title,
            item_identical_name: '',
            name: item.title,
        };
    });
});

function addNewDiseaseHandler(preset: ILifeStyle) {
    if (useLifeStyleStoreRoot.isAlreadySelected(preset.type)) return;
    useLifeStyleStoreRoot.addNewLifeStyle({
        ...preset,
        life_style_type_id: preset.id,
        note: preset.des,
    });
}

const mostUsedLifeStyleFilteredByPresetDuplication = computed(() =>
    mostUsedLifeStyleList?.value?.filter(
        (mostUsedLifeStyle) =>
            presetList?.value?.findIndex((preset: any) => mostUsedLifeStyle.type === preset.name) === -1,
    ),
);
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <PrescriptionBaseComponentsPopperView
            v-for="item in presetList"
            :key="item.uuid"
            :item="item"
            :is-active-item="useLifeStyleStoreRoot.isAlreadySelected(item?.name)"
            @select:item="addNewDiseaseHandler"
        />

        <PrescriptionBaseComponentsPopperView
            v-for="item in mostUsedLifeStyleFilteredByPresetDuplication"
            :key="item.uuid"
            :item="item"
            :is-active-item="useLifeStyleStoreRoot.isAlreadySelected(item?.type)"
            @select:item="addNewDiseaseHandler"
        />
    </div>
</template>
