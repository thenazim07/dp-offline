<script setup lang="ts">
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useDiagnosisStoreRoot } from '~/stores/prescription/useDiagnosisStoreRoot';
const diagnosisStoreRoot = useDiagnosisStoreRoot();

const prescriptionPresetStore = usePrescriptionPresetStore();

const presetList = computed(() => prescriptionPresetStore.diagnosisPresets.data || []);

function selectItem(item: object) {
    if (diagnosisStoreRoot.isAlreadySelected(item?.name)) return;
    console.log(item)
    diagnosisStoreRoot.addNewDiagnosis({
        name: item?.name,
        note: item?.des,
    });
}
</script>

<template>
    <div class="flex max-h-[200px] flex-wrap items-center justify-start gap-2 overflow-auto scrollbar-thin">
        <PrescriptionBaseComponentsPopperView
            v-for="item in presetList"
            :key="item.uuid"
            :item="item"
            :is-active-item="diagnosisStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />
    </div>
</template>
