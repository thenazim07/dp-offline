<script setup lang="ts">
import { useEhrDrugStoreRoot } from '~/stores/ehr/useDrugStoreRoot';
import { useEhrStore } from '~/stores/ehr/';

const ehrStore = useEhrStore();
const { selectedListIndexToFocus } = storeToRefs(ehrStore);
const ehrDrugStoreRoot = useEhrDrugStoreRoot();
const { drugList } = storeToRefs(ehrDrugStoreRoot);
const isFirstRender = ref(true);

watch(
    () => drugList,
    () => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
        }
    },
    { deep: true },
);

onUnmounted(() => {
    ehrDrugStoreRoot.syncWithServer();
});

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();
const scrollableDivRef = ref<HTMLElement | null>(null);

function focusOnEmptyDrug() {
    const lastEmptyElementsIndexInDrugList = drugList.value.length - 1;
    focusOnSpecificNodelListIndexInput(scrollableDivRef.value, inputClassToFocus, lastEmptyElementsIndexInDrugList);
}

defineExpose({
    scrollableDivRef,
});

onMounted(() => {
    if (!selectedListIndexToFocus.value) focusOnEmptyDrug();
});
</script>

<template>
    <div class="w-full">
        <div
            ref="scrollableDivRef"
            class="mt-0 h-[300px] space-y-2 overflow-auto bg-slate-100 pb-3 pl-2 pr-[10px] pt-3 max-1919:h-[205px]"
        >
            <PrescriptionEhrDrugInput
                v-for="(drug, index) in drugList"
                :key="drug.drug_ref"
                :drug="drug"
                :index="index"
                :is-removable="index !== drugList.length - 1"
            />
            <!-- :autofocus="isFirstRender && index === drugList.length - 1" -->
        </div>

        <div class="mt-6 h-[100px] overflow-auto rounded bg-white p-4 scrollbar-thin">
            <PrescriptionEhrDrugPreset />
        </div>
    </div>
</template>
