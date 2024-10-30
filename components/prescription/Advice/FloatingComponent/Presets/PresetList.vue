<script setup lang="ts">
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useAdviceStoreRoot } from '~/stores/prescription/useAdviceStoreRoot';
const adviceStoreRoot = useAdviceStoreRoot();

const prescriptionPresetStore = usePrescriptionPresetStore();

const presetList = computed(() => prescriptionPresetStore.advicePresets.data || []);

const { mostUsedAdvices } = storeToRefs(adviceStoreRoot);

function selectItem(item: object) {
    if (adviceStoreRoot.isAlreadySelected(item?.name)) return;
    adviceStoreRoot.addNewAdvice({
        name: item?.name,
    });
}

const mostUsedAdvicesFilteredByPresetDuplication = computed(() =>
    mostUsedAdvices?.value?.filter(
        (mostUsedAdvice) => presetList?.value?.findIndex((preset: any) => mostUsedAdvice.name === preset.name) === -1,
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
            :is-active-item="adviceStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />

        <PrescriptionBaseComponentsPopperView
            v-for="item in mostUsedAdvicesFilteredByPresetDuplication"
            :key="item.id"
            :item="item"
            :is-active-item="adviceStoreRoot.isAlreadySelected(item?.name)"
            @select:item="selectItem"
        />
    </div>
</template>
