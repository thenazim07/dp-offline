<script setup lang="ts">
import { useEhrDiseaseStoreRoot } from '~/stores/ehr/useDiseaseStoreRoot';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useEhrStore } from '~/stores/ehr/';

const ehrStore = useEhrStore();
const { selectedListIndexToFocus } = storeToRefs(ehrStore);
const prescriptionPresetStore = usePrescriptionPresetStore();
const ehrDiseaseStoreRoot = useEhrDiseaseStoreRoot();
const { diseaseList } = storeToRefs(ehrDiseaseStoreRoot);
const isFirstRender = ref(true);

watch(
    () => diseaseList,
    (currentList, prevList) => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
        }
    },
    { deep: true },
);

function loadPreData() {
    prescriptionPresetStore.fetchPresetDataForEhr('icd_code');
    ehrDiseaseStoreRoot.fetchMostUsedDisease();
}

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();
const scrollableDivRef = ref<HTMLElement | null>(null);

function focusOnEmptyDiseases() {
    if (!selectedListIndexToFocus.value) {
        const lastEmptyElementsIndexInDiseaseList = diseaseList.value.length - 1;
        focusOnSpecificNodelListIndexInput(
            scrollableDivRef.value,
            inputClassToFocus,
            lastEmptyElementsIndexInDiseaseList,
        );
    }
}

defineExpose({
    scrollableDivRef,
});

onMounted(() => {
    loadPreData();
    focusOnEmptyDiseases();
});

onUnmounted(() => {
    ehrDiseaseStoreRoot.syncWithServer();
});
</script>

<template>
    <div class="w-full">
        <div
            ref="scrollableDivRef"
            class="disease-input-list mt-0 h-[300px] space-y-2 overflow-auto bg-slate-100 pb-3 pl-2 pr-[10px] pt-3 max-1919:h-[205px]"
        >
            <PrescriptionEhrDiseaseInput
                v-for="(disease, index) in diseaseList"
                :key="disease.disease ?? 'UniqueDiseases'"
                :disease="disease"
                :index="index"
                :is-removable="index !== diseaseList.length - 1"
            />
            <!-- :autofocus="isFirstRender && index === diseaseList.length - 1" -->
        </div>
        <div class="mt-6 h-[100px] overflow-auto rounded bg-white p-4 scrollbar-thin">
            <PrescriptionEhrDiseasePreset />
        </div>
    </div>
</template>
