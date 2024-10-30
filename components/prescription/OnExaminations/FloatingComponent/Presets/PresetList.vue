<script setup lang="ts">
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';
const onExaminationStoreRoot = useOnExaminationStoreRoot();

const prescriptionPresetStore = usePrescriptionPresetStore();

const presetList = computed(() => prescriptionPresetStore.observationPresets.data || []);
const { mostUsedObservations } = storeToRefs(onExaminationStoreRoot);

function selectItem(item: object) {
    if (onExaminationStoreRoot.isAlreadySelected(item?.name)) return;
    onExaminationStoreRoot.addNewObservation({
        name: item?.name,
    });
}

function loadPreData() {
    onExaminationStoreRoot.fetchMostUsedObservations();
}

onMounted(() => {
    loadPreData();
});

const mostUsedObservationsFilteredByPresetDuplication = computed(() =>
    mostUsedObservations?.value?.filter(
        (mostUsedObservation) =>
            presetList?.value?.findIndex((preset: any) => mostUsedObservation.name === preset.name) === -1,
    ),
);
</script>

<template>
    <div
        class="flex h-[200px] flex-wrap items-start justify-start gap-2 overflow-auto scrollbar-thin max-1919:h-[190px] max-1599:h-[103px]"
    >
        <PrescriptionBaseComponentsPopperView
            v-for="item in presetList"
            :key="item.uuid"
            :item="item"
            :is-active-item="onExaminationStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />

        <PrescriptionBaseComponentsPopperView
            v-for="item in mostUsedObservationsFilteredByPresetDuplication"
            :key="item.id"
            :item="item"
            :is-active-item="onExaminationStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />
    </div>
</template>
