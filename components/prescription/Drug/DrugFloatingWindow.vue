<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { usePrescriptionGroupStore } from '~/stores/prescription/group';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
import { usePrescriptionDrugFrequenciesStore } from '~/stores/prescription/useDrugStore/frequencies';
import { usePrescriptionDrugInstructionsStore } from '~/stores/prescription/useDrugStore/instructions';
const prescriptionDrugStore = usePrescriptionDrugStore();
const prescriptionPresetStore = usePrescriptionPresetStore();
const prescriptionGroupStore = usePrescriptionGroupStore();
const prescriptionDrugFrequencyStore = usePrescriptionDrugFrequenciesStore();
const prescriptionDrugInstructionStore = usePrescriptionDrugInstructionsStore();
const { drugs, isShowingDrugEditor, isGroupMode, currentGroup } = storeToRefs(prescriptionDrugStore);

const { selectedListIndexToFocus } = storeToRefs(prescriptionDrugStore);

//  start of scroll to last added drug list
const drugInputListElement = ref<HTMLDivElement | null>(null);
// useMutationObserver(drugInputListElement as Ref<HTMLDivElement>);

//  end of scroll to last added drug list

function loadPreData() {
    // prescriptionDrugStore.fetchDosageForms();
    // prescriptionDrugFrequencyStore.getFrequencies();
    // prescriptionDrugInstructionStore.getInstructions();

    prescriptionPresetStore.fetchPresetData('medicine');
    prescriptionGroupStore.fetchGroupData('medicine');
    prescriptionDrugStore.fetchMostUsedDrugs();
}

onUnmounted(() => {
    prescriptionDrugStore.syncWithServer();
});

const container = ref<HTMLDivElement | null>(null);
onClickOutside(container, () => (isShowingDrugEditor.value = false), {
    ignore: [document.querySelector('.DrugSectionClass'), document.getElementById('teleports')],
});

function onCancelEditModeClick() {
    prescriptionDrugStore.cancelGroupMode();
}
const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();

const onListClickHandler = () => {
    if (selectedListIndexToFocus.value != null) {
        focusOnSpecificNodelListIndexInput(
            drugInputListElement.value,
            inputClassToFocus,
            selectedListIndexToFocus.value,
        );
    }
    selectedListIndexToFocus.value = null;
};

onMounted(() => {
    loadPreData();
    onListClickHandler();
});

watch(
    () => drugs.value,
    (drugList, prevDrugList) => {
        nextTick(() => {
            const isDrugInserted = drugList.length > prevDrugList.length;

            if (isDrugInserted)
                focusOnSpecificNodelListIndexInput(drugInputListElement.value, inputClassToFocus, drugList.length - 1);
        });
    },
);
</script>

<template>
    <div
        ref="container"
        class="w-[1036px] max-1919:w-[892px] max-1599:max-w-[780px]"
    >
        <!--header--section-->
        <div class="bg-slate-200 px-3 py-2">
            <div class="flex max-w-[1030px] items-center">
                <div class="mr-2 min-w-[130px] flex-shrink-0">
                    <h1 class="text-lg font-bold text-[#1E293B]">Add Medicine</h1>
                </div>
                <PrescriptionDrugFloatingComponentFormSearch class="w-full max-w-[35rem]" />
            </div>
        </div>

        <div
            ref="drugInputListElement"
            class="relative h-[296px] divide-y divide-dashed divide-[#64748B] overflow-y-scroll p-3 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md max-1919:h-[183px] max-1599:h-[165px]"
        >
            <PrescriptionDrugFloatingComponentFormDrugInput
                v-for="(drug, index) in drugs"
                :key="drug.uuid"
                :drug="drug"
                :index="index"
            />
        </div>

        <div class="h-[352px] bg-slate-200 max-1919:h-[239px] max-1599:h-[211px]">
            <div class="px-4 pt-6 max-1919:pt-0">
                <div class="relative text-end">
                    <button
                        type="button"
                        class="rounded border border-blue-600 px-2.5 py-1.5 text-blue-600 transition-colors duration-200 ease-in-out hover:bg-blue-600 hover:text-white max-1919:absolute max-1919:right-0 max-1919:top-[10px] max-1919:text-xs max-1919:font-[500] max-1919:leading-[18px]"
                        @click.prevent="isGroupMode = true"
                    >
                        Create Group
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <div class="p-4 text-center font-semibold text-slate-950">Medicine</div>
                        <div
                            class="h-[220px] overflow-auto rounded-[4px] bg-white scrollbar scrollbar-thin max-1919:h-[163px] max-1599:h-[135px]"
                        >
                            <div class="flex flex-wrap p-4 max-1919:p-3">
                                <PrescriptionDrugPresets />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="p-4 text-center font-semibold text-slate-950">Medicine Group</div>
                        <div
                            class="h-[220px] overflow-auto rounded-[4px] bg-white scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md max-1919:h-[163px] max-1599:h-[135px]"
                        >
                            <div class="flex flex-col flex-wrap gap-2">
                                <PrescriptionDrugPresetGroups />
                                <div
                                    v-if="isGroupMode"
                                    class="flex items-center justify-start gap-2 pb-4 pl-4 max-1919:h-[58px] max-1919:pb-3 max-1919:pl-3"
                                >
                                    <form
                                        class="flex items-center justify-start gap-2 rounded-full border-8 border-slate-300 p-2 max-1919:p-1"
                                        @submit.prevent="prescriptionDrugStore.saveGroup"
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
                                                tailwindMerge(
                                                    'bg-primary-600 hover:bg-primary-600 rounded-full p-2 max-1919:p-1',
                                                    {
                                                        ' bg-slate-300 ': currentGroup.name.length == 0,
                                                    },
                                                )
                                            "
                                        >
                                            <LibIconSave class="max-1919:h-[24px] max-1919:w-[24px]" />
                                        </button>
                                    </form>
                                    <button
                                        type="button"
                                        @click.prevent="onCancelEditModeClick"
                                    >
                                        <XMarkIcon
                                            class="block h-8 w-8 text-slate-500 max-1919:h-6 max-1919:w-6"
                                        ></XMarkIcon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
