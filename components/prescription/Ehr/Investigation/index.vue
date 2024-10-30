<script setup lang="ts">
import { useEhrInvestigationStoreRoot } from '~/stores/ehr/useInvestigationStoreRoot';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useEhrStore } from '~/stores/ehr/';

const ehrStore = useEhrStore();
const { selectedListIndexToFocus } = storeToRefs(ehrStore);

const prescriptionPresetStore = usePrescriptionPresetStore();
const ehrInvestigationStoreRoot = useEhrInvestigationStoreRoot();
const { investigationList } = storeToRefs(ehrInvestigationStoreRoot);
const isFirstRender = ref(true);
const { initialInvestigationSearchFetch } = useEhrInvestigationSearch();

watch(
    () => investigationList,
    () => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
        }
    },
    { deep: true },
);

function loadPreData() {
    prescriptionPresetStore.fetchPresetDataForEhr('investigation_history');
}

onMounted(() => {
    loadPreData();
    if (!selectedListIndexToFocus.value) focusOnEmptyInvestigation();
});

onUnmounted(() => {
    ehrInvestigationStoreRoot.syncWithServer();
});

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();
const scrollableDivRef = ref<HTMLElement | null>(null);

function focusOnEmptyInvestigation() {
    const lastEmptyElementsIndexInInvestigationList = investigationList.value.length - 1;
    focusOnSpecificNodelListIndexInput(
        scrollableDivRef.value,
        inputClassToFocus,
        lastEmptyElementsIndexInInvestigationList,
    );
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
            <PrescriptionEhrInvestigationInput
                v-for="(investigation, index) in investigationList"
                :key="investigation.uuid"
                :investigation="investigation"
                :index="index"
                :is-removable="index !== investigationList.length - 1"
            />
            <!-- :autofocus="isFirstRender && index === investigationList.length - 1" -->
        </div>

        <div class="mt-6 h-[100px] overflow-auto rounded bg-white p-4 scrollbar-thin">
            <PrescriptionEhrInvestigationPreset />
        </div>
    </div>
</template>
