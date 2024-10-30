<script lang="ts" setup>
import { PlusIcon } from '@heroicons/vue/24/outline';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const drugReference = ref(null);
const drugFloating = ref<HTMLElement>(null);
const { bodySectionFormData } = storeToRefs(useLayoutsStore());

const printable = computed(
    () =>
        bodySectionFormData.value.body.columns.column0.items.drug?.label.printable ??
        bodySectionFormData.value.body.columns.column1.items.drug?.label.printable,
);

const { floatingStyles } = useFloatingElement(drugReference, drugFloating, {
    placement: 'right-start',
});

const prescriptionDrugStore = usePrescriptionDrugStore();
const { drugs, isShowingDrugEditor, selectedListIndexToFocus, isSavingDrugs } = storeToRefs(prescriptionDrugStore);

const onListClickHandler = (index: any) => {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingDrugEditor.value = true;
        selectedListIndexToFocus.value = index;
    }
};

function openDrugEditor() {
    if (useCheckAllFloatingWindowClosed()) {
        isShowingDrugEditor.value = true;
    }
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    prescriptionDrugStore.syncWithServer();
}
</script>

<template>
    <div
        class="DrugSectionClass mb-44 w-full"
        :class="[
            status.drug.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.drug.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="flex justify-between">
            <!--#rx feature button-->
            <button
                ref="drugReference"
                :class="{ 'bg-slate-200': isShowingDrugEditor }"
                class="relative flex h-[60px] w-[76px] items-center rounded p-2 transition duration-300 focus:bg-slate-200 active:bg-slate-200"
                @click.prevent="openDrugEditor"
            >
                <div class="flex items-center justify-center">
                    <img
                        src="~/assets/images/preview/rx.svg"
                        alt="rx_svg"
                        :class="!printable ? 'opacity-15' : ''"
                    />
                </div>

                <PlusIcon class="absolute bottom-1 right-2 h-6 w-6 text-slate-900" />
            </button>
            <PrescriptionCommonPrescriptionCreateSavingStatus
                :status="status.drug"
                @retry="retryForSaving"
            />
            <!--end rx feature button-->
        </div>

        <!-- @click.prevent="isShowingDrugEditor = !isShowingDrugEditor" -->
        <figure
            :class="
                tailwindMerge('w-full divide-y divide-dashed divide-[#CBD5E1]', {
                    'animate-pulse': isSavingDrugs,
                })
            "
        >
            <PrescriptionDrugPrescriptionScreenComponentDrugListItem
                v-for="(drug, index) in drugs"
                :key="drug.ref"
                :drug="drug"
                :index="index"
                @onListClick="onListClickHandler"
            />
        </figure>
    </div>

    <div
        v-if="isShowingDrugEditor"
        ref="drugFloating"
        class="z-10 overflow-hidden rounded-lg bg-slate-100 shadow-[0_0px_16px_0px_rgba(0,0,0,0.16)]"
        :style="floatingStyles"
    >
        <PrescriptionDrugFloatingWindow />
    </div>
</template>
