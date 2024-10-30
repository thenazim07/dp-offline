<script setup lang="ts">
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useInvestigationStoreRoot } from '~/stores/prescription/useInvestigationStoreRoot';
const investigationStoreRoot = useInvestigationStoreRoot();

const prescriptionPresetStore = usePrescriptionPresetStore();

const { mostUsedInvestigations } = storeToRefs(investigationStoreRoot);
const presetList = computed(() => prescriptionPresetStore.investigationPresets.data || []);

function selectItem(item: object) {
    if (investigationStoreRoot.isAlreadySelected(item?.name)) return;

    investigationStoreRoot.addNewInvestigation({
        name: item?.name,
        instruction: item.des,
    });
}

const mostUsedInvestigationsFilteredByPresetDuplication = computed(() =>
    mostUsedInvestigations?.value?.filter(
        (mostUsedInvestigation) =>
            presetList?.value?.findIndex((preset: any) => mostUsedInvestigation.name === preset.name) === -1,
    ),
);
</script>

<template>
    <div
        class="flex max-h-[200px] flex-wrap items-center justify-start gap-2 overflow-auto scrollbar-thin max-1919:h-[176px] max-1599:h-[120px]"
    >
        <PrescriptionBaseComponentsPopperView
            v-for="item in presetList"
            :key="item.uuid"
            :item="item"
            :is-active-item="investigationStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />

        <PrescriptionBaseComponentsPopperView
            v-for="item in mostUsedInvestigationsFilteredByPresetDuplication"
            :key="item.ref"
            :item="item"
            :is-active-item="investigationStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />
    </div>
</template>
