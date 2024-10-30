<script lang="ts" setup>
import { v4 as uuid } from 'uuid';
import { usePrescriptionPresetStore } from '~~/stores/prescription/preset';
import { useEhrFamilyStoreRoot } from '~/stores/ehr/useFamilyStoreRoot';
import type { IFamily } from '~/repository/modules/EHR/FamilyHistory/types';

const preset = usePrescriptionPresetStore();
const { presetForIcdCode } = storeToRefs(preset);
const ehrFamilyStoreRoot = useEhrFamilyStoreRoot();

const presetList = computed(() => {
    if (presetForIcdCode?.value?.data) {
        return presetForIcdCode.value.data.map((item: IFamily) => {
            return {
                ...item,
                uuid: uuid(),
                icd_code_ref: preset.code,
                disease: item.name,
            };
        });
    }
    return [];
});

const mostUsedFamilyHistories = computed(() => {
    return ehrFamilyStoreRoot.mostUsedFamilyHistoryList.map((item) => {
        return {
            ...item,
            uuid: uuid(),
            name: item.title,
            disease: item.title,
        };
    });
});

function addNewFamilyHandler(preset: IFamily) {
    if (ehrFamilyStoreRoot.isAlreadySelected(preset?.disease)) return;
    ehrFamilyStoreRoot.addNewFamily({
        ...preset,
        icd_code_ref: preset.code,
        note: preset.des,
    });
}

const mostUsedFamilyHistoriesFilteredByPresetDuplication = computed(() =>
    mostUsedFamilyHistories?.value?.filter(
        (mostUsedFamilyHistory) =>
            presetList?.value?.findIndex((preset: any) => mostUsedFamilyHistory.title === preset.name) === -1,
    ),
);
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <PrescriptionBaseComponentsPopperView
            v-for="item in presetList"
            :key="item.uuid"
            :item="item"
            :is-active-item="ehrFamilyStoreRoot.isAlreadySelected(item?.name)"
            @select:item="addNewFamilyHandler"
        />

        <PrescriptionBaseComponentsPopperView
            v-for="item in mostUsedFamilyHistoriesFilteredByPresetDuplication"
            :key="item.uuid"
            :item="item"
            :is-active-item="ehrFamilyStoreRoot.isAlreadySelected(item?.title)"
            @select:item="addNewFamilyHandler"
        />
    </div>
</template>
