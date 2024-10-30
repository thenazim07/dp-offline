<script setup lang="ts">
import { useEhrFamilyStoreRoot } from '~/stores/ehr/useFamilyStoreRoot';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useEhrStore } from '~/stores/ehr/';

const ehrStore = useEhrStore();
const { selectedListIndexToFocus } = storeToRefs(ehrStore);

const prescriptionPresetStore = usePrescriptionPresetStore();
const ehrFamilyStoreRoot = useEhrFamilyStoreRoot();
const { familyList } = storeToRefs(ehrFamilyStoreRoot);
const isFirstRender = ref(true);

watch(
    () => familyList,
    () => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
        }
    },
    { deep: true },
);

function loadPreData() {
    prescriptionPresetStore.fetchPresetDataForEhr('icd_code');
    ehrFamilyStoreRoot.fetchMostUsedFamilyHistory();
}

onMounted(() => {
    loadPreData();
    if (!selectedListIndexToFocus.value) focusOnEmptyFamilyInput();
});

onUnmounted(() => {
    ehrFamilyStoreRoot.syncWithServer();
});

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();
const scrollableDivRef = ref<HTMLElement | null>(null);

function focusOnEmptyFamilyInput() {
    const lastEmptyElementsIndexInFamilyList = familyList.value.length - 1;
    focusOnSpecificNodelListIndexInput(scrollableDivRef.value, inputClassToFocus, lastEmptyElementsIndexInFamilyList);
}

defineExpose({
    scrollableDivRef,
});
</script>

<template>
    <div class="w-full">
        <div
            ref="scrollableDivRef"
            class="mt-0 h-[300px] space-y-2 overflow-auto bg-slate-100 pb-2 pl-2 pr-[10px] pt-3 max-1919:h-[205px]"
        >
            <PrescriptionEhrFamilyInput
                v-for="(family, index) in familyList"
                :key="family.disease ?? 'uniqueid'"
                :family="family"
                :index="index"
                :is-removable="index !== familyList.length - 1"
            />
            <!-- :autofocus="isFirstRender && index === familyList.length - 1" -->
        </div>

        <div class="mt-6 h-[100px] overflow-auto rounded bg-white p-4 scrollbar-thin">
            <PrescriptionEhrFamilyPreset />
        </div>
    </div>
</template>
