<script lang="ts" setup>
import { useOtherHistoryStoreRoot } from '~/stores/ehr/useOtherHistoryRoot';
import { useEhrStore } from '~/stores/ehr/';

const ehrStore = useEhrStore();
const { selectedListIndexToFocus } = storeToRefs(ehrStore);
const otherHistoryStoreRoot = useOtherHistoryStoreRoot();
const { surgicalList } = storeToRefs(otherHistoryStoreRoot);
const isFirstRender = ref(true);

watch(
    () => surgicalList,
    () => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
        }
    },
    { deep: true },
);

function loadPreData() {
    otherHistoryStoreRoot.fetchSurgicalType();
}

onMounted(() => {
    loadPreData();
    if (!selectedListIndexToFocus.value) focusOnEmptySurgical();
});

onUnmounted(() => {
    otherHistoryStoreRoot.syncWithServer();
});

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();
const scrollableDivRef = ref<HTMLElement | null>(null);

function focusOnEmptySurgical() {
    const lastEmptyElementsIndexInSurgicalList = surgicalList.value.length - 1;
    focusOnSpecificNodelListIndexInput(scrollableDivRef.value, inputClassToFocus, lastEmptyElementsIndexInSurgicalList);
}

defineExpose({
    scrollableDivRef,
});
</script>

<template>
    <section>
        <p class="pb-2 text-base font-bold text-slate-900">Surgical History</p>

        <div
            ref="scrollableDivRef"
            class="h-[152px] space-y-2 overflow-y-auto rounded-[8px] bg-slate-200 p-3 scrollbar-thin scrollbar-stable max-1919:max-h-[132px] max-1919:min-h-[132px]"
        >
            <PrescriptionEhrOthersSurgicalInput
                v-for="(surgical, index) in surgicalList"
                :key="surgical.uuid"
                :surgical="surgical"
                :index="index"
                :autofocus="isFirstRender && index === surgicalList.length - 1"
            />
            <!-- :is-removable="index !== surgicalList.length - 1" -->
        </div>
    </section>
</template>
