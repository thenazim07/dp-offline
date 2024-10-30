<script setup lang="ts">
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useChiefComplaintsStoreRoot } from '~/stores/prescription/useChiefComplaintsStoreRoot';
const chiefComplaintsStoreRoot = useChiefComplaintsStoreRoot();

const prescriptionPresetStore = usePrescriptionPresetStore();

const presetList = computed(() => prescriptionPresetStore.chiefComplaintsPresets.data || []);

const { mostUsedIndications } = storeToRefs(chiefComplaintsStoreRoot);

const mostUsedIndicationsFilteredByPresetDuplication = computed(() =>
    mostUsedIndications?.value?.filter(
        (mostUsedIndication) =>
            presetList?.value?.findIndex((preset: any) => mostUsedIndication.name === preset.name) === -1,
    ),
);

function selectItem(item: object) {
    if (chiefComplaintsStoreRoot.isAlreadySelected(item?.name)) return;

    chiefComplaintsStoreRoot.addNewIndication({
        name: item?.name,
        value: item?.des,
    });
}
</script>

<template>
    <div
        class="flex max-h-[200px] flex-wrap items-center justify-start gap-2 overflow-auto scrollbar-thin max-1919:h-[147px] max-1599:h-[120px]"
    >
        <PrescriptionBaseComponentsPopperView
            v-for="item in presetList"
            :key="item.uuid"
            :item="item"
            :is-active-item="chiefComplaintsStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />
        <PrescriptionBaseComponentsPopperView
            v-for="item in mostUsedIndicationsFilteredByPresetDuplication"
            :key="item.id"
            :item="item"
            :is-active-item="chiefComplaintsStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />
    </div>
</template>
