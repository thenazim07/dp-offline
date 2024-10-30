<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useChiefComplaintsStoreRoot } from '~/stores/prescription/useChiefComplaintsStoreRoot';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';
const chiefComplaintsStoreRoot = useChiefComplaintsStoreRoot();
const chiefComplaintStore = useChiefComplaintsStore();
const prescriptionPresetStore = usePrescriptionPresetStore();
const prescriptionGroupStore = usePrescriptionGroupStore();

const {
    chiefComplaints,
    isShowingChiefComplaintEditor,
    isGroupMode,
    currentGroup,
    selectedChiefComplainListIndexToFocus,
    indicationsSearchList,
} = storeToRefs(chiefComplaintsStoreRoot);

const container = ref<HTMLDivElement | null>(null);
const isFirstRender = ref(true);

onClickOutside(
    container,
    () => {
        if (
            useHasUniquePropertyValuesOfObjects(
                chiefComplaints.value.filter((complain) => complain.name.trim() !== ''),
                'name',
            )
        ) {
            isShowingChiefComplaintEditor.value = false;
        }
    },
    {
        ignore: [document.querySelector('.ChiefComplaintsSectionClass'), document.getElementById('teleports')],
    },
);

watch(
    () => chiefComplaints,
    () => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
        }
    },
    { deep: true },
);

function loadPreData() {
    prescriptionPresetStore.fetchPresetData('chief_complain');
    prescriptionGroupStore.fetchGroupData('chief_complain');
    chiefComplaintsStoreRoot.fetchMostUsedIndications();
}

onMounted(async () => {
    loadPreData();
    onChiefComplainListClickHandler();
    // indicationsSearchList.value = await chiefComplaintStore.searchChiefComplaintsTest('');
});

onUnmounted(() => {
    chiefComplaintsStoreRoot.syncWithServer();
});

function onCancelEditModeClick() {
    chiefComplaintsStoreRoot.cancelGroupMode();
}

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();
const scrollableDivRef = ref<HTMLElement | null>(null);

const onChiefComplainListClickHandler = async () => {
    if (selectedChiefComplainListIndexToFocus.value != null) {
        focusOnSpecificNodelListIndexInput(
            scrollableDivRef.value,
            inputClassToFocus,
            selectedChiefComplainListIndexToFocus.value,
        );
    } else {
        const lastEmptyElementsIndexInChiefComplainsList = chiefComplaints.value.length - 1;
        focusOnSpecificNodelListIndexInput(
            scrollableDivRef.value,
            inputClassToFocus,
            lastEmptyElementsIndexInChiefComplainsList,
        );
    }
    await nextTick();
    selectedChiefComplainListIndexToFocus.value = null;
};
</script>

<template>
    <div
        ref="container"
        class="z-10 rounded-lg bg-slate-200 p-4"
    >
        <div>
            <PrescriptionCommonPrescriptionSectionTitle
                title="Chief Complaints"
                :show-icon="false"
            />
        </div>
        <div
            ref="scrollableDivRef"
            class="mt-6 h-[250px] space-y-2 overflow-y-auto bg-slate-100 pb-[8px] pl-2 pr-[10px] pt-3 scrollbar-thin scrollbar-stable max-1919:mt-4 max-1919:h-[188px] max-1599:mt-3 max-1599:max-h-[152px] max-1599:min-h-[152px]"
        >
            <PrescriptionChiefComplaintsFloatingComponentFormIndicationInput
                v-for="(chiefComplaint, index) in chiefComplaints"
                :key="chiefComplaint.ref ?? chiefComplaint.uuid"
                :indication="chiefComplaint"
                :index="index"
                :is-removable="index !== chiefComplaints.length - 1"
                :is-last-element="index === chiefComplaints.length - 1"
            />
            <!-- :autofocus="isFirstRender && index === chiefComplaints.length - 1" -->
        </div>

        <div
            v-if="!isGroupMode"
            class="relative mt-6 text-end max-1919:mt-0"
        >
            <button
                type="button"
                class="rounded border border-blue-600 px-2.5 py-1.5 text-blue-600 transition-colors duration-200 ease-in-out hover:bg-blue-600 hover:text-white max-1919:absolute max-1919:right-0 max-1919:top-[10px] max-1919:text-xs max-1919:font-[500] max-1919:leading-[18px]"
                @click.prevent="isGroupMode = true"
            >
                Create Group
            </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col">
                <div class="p-4 text-center font-semibold text-slate-950">Chief Complaints</div>
                <div class="mt-1 flex-grow rounded bg-white p-4 max-1599:p-3">
                    <PrescriptionChiefComplaintsFloatingComponentPresetsPresetList />
                </div>
            </div>
            <div class="flex flex-col">
                <div class="p-4 text-center font-semibold text-slate-950">Chief Complaints Group</div>
                <div class="mt-1 flex flex-grow flex-col gap-2 rounded bg-white p-4 max-1599:p-3">
                    <PrescriptionChiefComplaintsFloatingComponentPresetsPresetGroupList />
                    <div
                        v-if="isGroupMode"
                        class="flex items-center justify-start gap-2 max-1919:h-[58px]"
                    >
                        <form
                            class="flex items-center justify-start gap-2 rounded-full border-8 border-slate-300 p-2 max-1919:p-1"
                            @submit.prevent="chiefComplaintsStoreRoot.saveGroup"
                        >
                            <input
                                v-model="currentGroup.name"
                                class="border-none border-transparent focus:border-transparent focus:ring-0 max-1919:w-[196px] max-1919:p-0 max-1919:text-sm"
                                type="text"
                                placeholder="Name of group"
                            />
                            <button
                                type="submit"
                                :class="
                                    tailwindMerge('bg-primary-600 hover:bg-primary-600 rounded-full p-2 max-1919:p-1', {
                                        ' bg-slate-300 ': currentGroup.name.length == 0,
                                    })
                                "
                            >
                                <LibIconSave class="max-1919:h-[24px] max-1919:w-[24px]" />
                            </button>
                        </form>
                        <button
                            type="button"
                            @click.prevent="onCancelEditModeClick"
                        >
                            <XMarkIcon class="block h-8 w-8 text-slate-500 max-1919:h-6 max-1919:w-6"></XMarkIcon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
