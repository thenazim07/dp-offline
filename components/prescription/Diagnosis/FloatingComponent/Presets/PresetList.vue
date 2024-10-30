<script setup lang="ts">
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useDiagnosisStoreRoot } from '~/stores/prescription/useDiagnosisStoreRoot';
const diagnosisStoreRoot = useDiagnosisStoreRoot();

const prescriptionPresetStore = usePrescriptionPresetStore();

const { mostUsedDiagnosis } = storeToRefs(diagnosisStoreRoot);

const presetList = computed(() => prescriptionPresetStore.diagnosisPresets.data || []);

function selectItem(item: object) {
    if (diagnosisStoreRoot.isAlreadySelected(item?.name)) return;
    diagnosisStoreRoot.addNewDiagnosis({
        name: item?.name,
        note: item?.des,
    });
}

const mostUsedDiagnosisFilteredByPresetDuplication = computed(() =>
    mostUsedDiagnosis?.value?.filter(
        (mostUsedDiagnosis) =>
            presetList?.value?.findIndex((preset: any) => mostUsedDiagnosis.name === preset.name) === -1,
    ),
);
</script>

<template>
    <div
        class="flex max-h-[200px] flex-wrap items-start gap-2 overflow-auto scrollbar-thin max-1919:h-[176px] max-1599:h-[120px]"
    >
        <PrescriptionBaseComponentsPopperView
            v-for="item in presetList"
            :key="item.uuid"
            :item="item"
            :is-active-item="diagnosisStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />
        <PrescriptionBaseComponentsPopperView
            v-for="item in mostUsedDiagnosisFilteredByPresetDuplication"
            :key="item.id"
            :item="item"
            :is-active-item="diagnosisStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />
    </div>
</template>
