<script setup lang="ts">
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import type { IDuration } from '~/repository/modules/Prescription/DrugsModule/types';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
import { usePrescriptionDrugFrequenciesStore } from '~/stores/prescription/useDrugStore/frequencies';
import { usePrescriptionDrugInstructionsStore } from '~/stores/prescription/useDrugStore/instructions';

const props = withDefaults(
    defineProps<{
        drugIndex: number;
        index: number;
        duration: IDuration;
        isShowAddMore: boolean;
        totalDurations: number;
    }>(),
    {
        drugIndex: 0,
        index: 0,
        isShowAddMore: false,
        totalDurations: 0,
    },
);

const { duration_types_for_drug } = storeToRefs(useConfigsStore());

const prescriptionDrugStore = usePrescriptionDrugStore();
const { isEnterClickedOnDurationInput, drugs, selectedListIndexToFocus } = storeToRefs(prescriptionDrugStore);

const frequency = computed({
    get: () => props.duration?.frequency,
    set: (value) => prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'frequency', value),
});

const instruction = computed({
    get: () => props.duration?.instruction,
    set: (value) => prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'instruction', value),
});

const duration = computed({
    get: () => props.duration?.duration,
    set: (value: any) => prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'duration', value),
});

const durationType = computed({
    get: () => props.duration?.type,
    set: (value: any) => prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'type', value),
});

const durationLocale = computed({
    get: () => props.duration?.locale || 'en',
    set: (value: any) => prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'locale', value),
});

function onCLickDurationItemRemoveHandler() {
    prescriptionDrugStore.removeDrugDuration(props.drugIndex!, props.index!);
}

function onCLickAddMoreDurationItemHandler() {
    prescriptionDrugStore.addMoreDurationItem(props.drugIndex!);
}

const { inputClassToFocus } = useFocusOnParentElementsLastInputElement();

const drugDurationRef = ref<HTMLElement | null>(null);

function goToNextInput(index: number) {
    if (drugDurationRef.value) {
        drugDurationRef.value.getElementsByTagName('input')[index].focus();
    }
}

function onClickEnterHandlerForDuration() {
    isEnterClickedOnDurationInput.value = true;
}

const prescriptionDrugFrequenciesStore = usePrescriptionDrugFrequenciesStore();

const fetchFrequencies = useDebounceFn(async (query: string) => {
    if (query.includes('+')) query = query.replaceAll('+', '%2B');
    if (props.drugIndex > -1)
        return await prescriptionDrugFrequenciesStore.getFrequenciesWithSearchKey(
            query,
            drugs.value[props.drugIndex].drug_ref || drugs.value[props.drugIndex].ref,
            drugs.value[props.drugIndex].dosage_form_ref || drugs.value[props.drugIndex].dosage_form?.ref,
        );

    return [];
}, 300);

const prescriptionDrugInstructionsStore = usePrescriptionDrugInstructionsStore();

const fetchInstructions = useDebounceFn(async (query: string) => {
    // console.log('FROM FETCH', query);
    if (query.includes('+')) query = query.replaceAll('+', '%2B');
    if (props.drugIndex > -1)
        return await prescriptionDrugInstructionsStore.getInstructionsBySearchKey(
            query,
            drugs.value[props.drugIndex].drug_ref || drugs.value[props.drugIndex].ref,
        );

    return [];
}, 300);

async function handleFrequencySelect(selectedItem: any) {
    prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'frequency', selectedItem.name);
    await nextTick(); // Ensure the DOM is updated
    goToNextInput(1);
}

async function fetchDrugFrequencies(query?: string) {
    if (query?.includes('+')) {
        query = query.replaceAll('+', '%2B');
    }

    if (props.drugIndex > -1) {
        const _frequinces = await prescriptionDrugFrequenciesStore.getFrequenciesWithSearchKey(
            query,
            drugs.value[props.drugIndex].drug_ref || drugs.value[props.drugIndex].ref,
            drugs.value[props.drugIndex].dosage_form_ref || drugs.value[props.drugIndex].dosage_form?.ref,
        );

        return _frequinces?.map((_frequincey) => {
            return {
                name: _frequincey.value,
                value: _frequincey.value,
            };
        });
    }

    return [];
}

async function fetchDrugInstructions(query?: string) {
    if (query?.includes('+')) {
        query = query.replaceAll('+', '%2B');
    }
    if (props.drugIndex > -1) {
        const _instructions = await prescriptionDrugInstructionsStore.getInstructionsBySearchKey(
            query,
            drugs.value[props.drugIndex].drug_ref || drugs.value[props.drugIndex].ref,
        );

        return _instructions?.map((_instruction) => {
            return {
                name: _instruction.value,
                value: _instruction.value,
            };
        });
    }

    return [];
}

async function handleInstructionSelect(selectedItem: any) {
    prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'instruction', selectedItem.name);
    await nextTick(); // Ensure the DOM is updated
    goToNextInput(2);
}
</script>

<template>
    <div
        ref="drugDurationRef"
        class="mb-2 grid grid-cols-3 gap-2"
    >
        <!-- <PrescriptionDrugFloatingComponentFormFrequency
            v-model:query="frequency"
            v-model="frequency"
            :class-to-focus="inputClassToFocus"
            :drug-index="drugIndex"
            @select-item="
                prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'frequency', $event.name)
            "
            @onInputKeyUpEnterHandler="goToNextInput(1)"
            @search="fetchFrequencies"
        /> -->
        <AutoComplete
            v-model="frequency"
            :initial-suggestions="[]"
            :fetch-suggestions="fetchDrugFrequencies"
            root-class=""
            input-parent-class=""
            :input-class="inputClassToFocus"
            ul-class=""
            li-class=""
            :initial-api-call="selectedListIndexToFocus === props.drugIndex"
            @select="handleFrequencySelect"
            @on-enter="goToNextInput(1)"
        />

        <!-- <PrescriptionDrugFloatingComponentFormInstruction
            v-model:query="instruction"
            v-model="instruction"
            :drug-index="drugIndex"
            @select-item="
                prescriptionDrugStore.updateDrugDuration(props.drugIndex!, props.index!, 'instruction', $event.name)
            "
            @change-value="goToNextInput(2)"
            @search="(e) => fetchInstructions(e)"
        /> -->

        <AutoComplete
            v-model="instruction"
            :initial-suggestions="[]"
            :fetch-suggestions="fetchDrugInstructions"
            root-class=""
            input-parent-class=""
            input-class=""
            ul-class=""
            li-class=""
            :initial-api-call="false"
            @select="handleInstructionSelect"
            @on-enter="goToNextInput(2)"
        />

        <div class="flex items-center">
            <PrescriptionBaseComponentsDurationWithType
                v-model:duration="duration"
                v-model:duration-type="durationType"
                v-model:duration-locale="durationLocale"
                :shown-duration-types="duration_types_for_drug"
                duration-locale-persist-store-type="drug"
                class="flex-1"
                use-drug-duration-type
                @onInputKeyUpEnterHandler="onClickEnterHandlerForDuration"
            />

            <div class="flex w-[64px] flex-shrink-0 space-x-2 p-2">
                <button
                    v-show="isShowAddMore"
                    type="button"
                    @click="onCLickAddMoreDurationItemHandler"
                >
                    <PlusIcon class="h-6 w-6 font-semibold text-[#64748B]" />
                </button>
                <button
                    :disabled="props.totalDurations === 1"
                    type="button"
                    class="disabled:opacity-30"
                    @click="onCLickDurationItemRemoveHandler"
                >
                    <XMarkIcon class="h-6 w-6 font-semibold text-[#64748B]" />
                </button>
            </div>
        </div>
    </div>
</template>
