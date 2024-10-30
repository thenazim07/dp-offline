<script setup lang="ts">
import { Bars3Icon, TrashIcon } from '@heroicons/vue/24/outline';
import type { IDrag } from '~/repository/modules/Prescription/DrugsModule/types';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';

const props = withDefaults(
    defineProps<{
        index: number;
        drug?: IDrag;
    }>(),
    {
        index: 0,
    },
);

const prescriptionDrugStore = usePrescriptionDrugStore();
const { dosageFormsList, isGroupMode, currentGroup } = storeToRefs(prescriptionDrugStore);
const drugName = computed<string>(() => generateDrugUniqName(props.drug!));
const totalDurations = computed(() => props.drug?.durations?.length || 0);
const isCustomDrug = computed(() => props.drug?.is_custom_drug);

// custom drug

const dosageFormRef = computed({
    get: () => props.drug?.dosage_form_ref,
    set: (value: any) => prescriptionDrugStore.updateDrug(props.index!, 'dosage_form_ref', value),
});

const dosageFormIcon = computed(
    () =>
        dosageFormsList.value.find((item) => item.ref === dosageFormRef.value)?.icon_url ||
        '/images/dosage_form_not_selected.svg',
);

const brandName = computed({
    get: () => props.drug?.brand_name,
    set: (value: any) => prescriptionDrugStore.updateDrug(props.index!, 'brand_name', value),
});

const genericRef = computed({
    get: () => props.drug?.generic_name,
    set: (value: any) => {
        prescriptionDrugStore.updateDrug(props.index!, 'generic_ref', value.ref);
        prescriptionDrugStore.updateDrug(props.index!, 'generic_name', value.name);
    },
});

// generic type sections
async function search(query: string) {
    if (query === '') return [];
    const result = await prescriptionDrugStore.searchGenerics(query);
    return result;
}

const note = computed<string>({
    get: () => {
        if (!Array.isArray(props.drug?.instructions)) return '';
        return props.drug?.instructions[0] || '';
    },
    set: (value: string) => prescriptionDrugStore.updateDrug(props.index!, 'instructions', [value]),
});

function onDrugDeleteClickHandler(): void {
    prescriptionDrugStore.deleteDrug(props.index);
}

// const query = computed({
//     get: () => props.drug?.name,
//     set: (value) => investigationStoreRoot.updateInvestigation(props.index!, 'name', value),
// });

const configFormStyle = {
    base: 'h-[48px] w-full font-normal border-none',
    rounded: 'rounded-md',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 focus:ring-1 focus:ring-blue-500 shadow-none',
        },
    },
};
</script>

<template>
    <div class="py-3">
        <div class="mb-2 flex items-center justify-between">
            <div
                v-if="!isCustomDrug"
                class="flex items-center"
            >
                <Bars3Icon class="mr-2 h-6 w-6 text-slate-600" />
                <h5 class="text-sm font-bold text-[#1E293B]">{{ props?.index + 1 }}. {{ drugName }}</h5>
            </div>

            <!--custom drug feature-->
            <div
                v-else
                class="mr-3 flex w-full space-x-3"
            >
                <div class="flex w-2/3 items-center divide-x rounded-md bg-white">
                    <div class="flex w-32 items-center">
                        <USelectMenu
                            v-model="dosageFormRef"
                            :ui="configFormStyle"
                            placeholder="Select"
                            :options="dosageFormsList"
                            value-attribute="ref"
                            option-attribute="short_name"
                        >
                            <template #leading>
                                <img
                                    :src="dosageFormIcon"
                                    class="h-5 w-5 text-slate-300"
                                />
                            </template>
                        </USelectMenu>
                    </div>

                    <div class="w-full flex-1">
                        <input
                            v-model="brandName"
                            class="h-[48px] w-full border-none text-sm font-normal text-gray-900 [appearance:textfield] focus:border-none focus:outline-none disabled:bg-gray-100"
                            type="text"
                            placeholder="Enter medicine name"
                        />
                    </div>
                </div>

                <div class="w-1/3">
                    <USelectMenu
                        v-model="genericRef"
                        :searchable="search"
                        placeholder="Generic Name"
                        option-attribute="name"
                        trailing
                        :ui="configFormStyle"
                    />
                </div>
            </div>
            <!--end custom drug feature-->

            <input
                v-if="isGroupMode"
                v-model="currentGroup.items"
                type="checkbox"
                :value="props.drug?.drug_id"
            />
            <button
                v-else
                type="button"
                @click.prevent="onDrugDeleteClickHandler"
            >
                <TrashIcon class="courser-pointer h-6 w-6 text-red-500" />
            </button>
        </div>

        <PrescriptionDrugFloatingComponentFormDrugDuration
            v-for="(duration, index) in props.drug?.durations"
            :key="index"
            :duration="duration"
            :drug-index="props.index"
            :index="index"
            :total-durations="totalDurations"
            :is-show-add-more="totalDurations === index + 1"
        />

        <div class="flex">
            <textarea
                v-model="note"
                placeholder="Note:"
                rows="1"
                class="w-full resize-none rounded border-none p-3"
            ></textarea>
        </div>
    </div>
</template>
