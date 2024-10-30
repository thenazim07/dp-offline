<script lang="ts" setup>
import { v4 as uuid } from 'uuid';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useEhrDiseaseStoreRoot } from '~/stores/ehr/useDiseaseStoreRoot';
import type { IDisease } from '~/repository/modules/EHR/DiseaseHistory/types';

const preset = usePrescriptionPresetStore();
const { presetForIcdCode } = storeToRefs(preset);
const ehrDiseaseStoreRoot = useEhrDiseaseStoreRoot();

const presetList = computed(() => {
    if (presetForIcdCode?.value?.data) {
        return presetForIcdCode.value.data.map((item: IDisease) => {
            return {
                ...item,
                uuid: uuid(),
                disease: item.name,
            };
        });
    }
    return [];
});

const mostUsedDiseaseList = computed(() => {
    return ehrDiseaseStoreRoot.mostUsedDiseaseList.map((item) => {
        return {
            ...item,
            name: item.title,
            uuid: uuid(),
            disease: item.title,
        };
    });
});

function addNewDiseaseHandler(preset: IDisease) {
    if (ehrDiseaseStoreRoot.isAlreadySelected(preset?.disease)) return;
    ehrDiseaseStoreRoot.addNewDisease({
        ...preset,
        icd_code_ref: preset.code,
        note: preset.des,
    });
}

const mostUsedDiseaseFilteredByPresetDuplication = computed(() =>
    mostUsedDiseaseList?.value?.filter(
        (mostUsedDisease) =>
            presetList?.value?.findIndex((preset: any) => mostUsedDisease.title === preset.name) === -1,
    ),
);
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <PrescriptionBaseComponentsPopperView
            v-for="item in presetList"
            :key="item.uuid"
            :item="item"
            :is-active-item="ehrDiseaseStoreRoot.isAlreadySelected(item?.name)"
            @select:item="addNewDiseaseHandler"
        />

        <PrescriptionBaseComponentsPopperView
            v-for="item in mostUsedDiseaseFilteredByPresetDuplication"
            :key="item.uuid"
            :item="item"
            :is-active-item="ehrDiseaseStoreRoot.isAlreadySelected(item?.title)"
            @select:item="addNewDiseaseHandler"
        />
    </div>
</template>
