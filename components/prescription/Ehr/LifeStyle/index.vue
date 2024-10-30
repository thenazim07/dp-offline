<script setup lang="ts">
import { useEhrLifeStyleStoreRoot } from '~/stores/ehr/useLifeStyleStoreRoot';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { useEhrStore } from '~/stores/ehr/';

const ehrStore = useEhrStore();
const { selectedListIndexToFocus } = storeToRefs(ehrStore);

const prescriptionPresetStore = usePrescriptionPresetStore();
const ehrLifeStyleStoreRoot = useEhrLifeStyleStoreRoot();
const { lifeStyleList } = storeToRefs(ehrLifeStyleStoreRoot);
const isFirstRender = ref(true);

watch(
    () => lifeStyleList,
    () => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
        }
    },
    { deep: true },
);

function loadPreData() {
    prescriptionPresetStore.fetchPresetDataForEhr('life_style_type');
    ehrLifeStyleStoreRoot.fetchMostUsedLifeStyle();
}

onMounted(() => {
    loadPreData();
    if (!selectedListIndexToFocus.value) focusOnEmptyLifeStyle();
});

onUnmounted(() => {
    ehrLifeStyleStoreRoot.syncWithServer();
});

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();
const scrollableDivRef = ref<HTMLElement | null>(null);

function focusOnEmptyLifeStyle() {
    const lastEmptyElementsIndexInLifeStyleList = lifeStyleList.value.length - 1;
    focusOnSpecificNodelListIndexInput(
        scrollableDivRef.value,
        inputClassToFocus,
        lastEmptyElementsIndexInLifeStyleList,
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
            class="mt-0 h-[300px] space-y-2 overflow-auto bg-slate-100 pl-2 pr-[10px] pt-3 max-1919:h-[205px]"
        >
            <PrescriptionEhrLifeStyleInput
                v-for="(lifeStyle, index) in lifeStyleList"
                :key="lifeStyle.type ?? lifeStyle.uuid ?? 'unique'"
                :life-style="lifeStyle"
                :index="index"
                :is-removable="index !== lifeStyleList.length - 1"
            />
            <!-- :autofocus="isFirstRender && index === lifeStyleList.length - 1" -->
        </div>

        <div class="mt-6 h-[100px] overflow-auto rounded bg-white p-4 scrollbar-thin">
            <PrescriptionEhrLifeStylePreset />
        </div>
    </div>
</template>
