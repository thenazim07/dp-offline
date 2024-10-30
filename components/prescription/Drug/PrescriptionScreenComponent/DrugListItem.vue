<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import type { IDrag } from '~/repository/modules/Prescription/DrugsModule/types';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
const prescriptionDrugStore = usePrescriptionDrugStore();

const props = withDefaults(
    defineProps<{
        index: number;
        drug?: IDrag;
    }>(),
    {
        index: 0,
    },
);

const drugName = computed<string>(() => generateDrugUniqName(props.drug!));
const genericName = computed(() => props.drug?.generic_name ?? props.drug?.generic?.name);
const durations = computed(() => props?.drug?.durations ?? []);
const instructions = computed(() => props?.drug?.instructions ?? []);

function handleDeleteDrugItem(uuid: string) {
    prescriptionDrugStore.removeDrugFromPrescription(uuid);
}

const emit = defineEmits(['onListClick']);
</script>

<template>
    <div class="flex w-full items-start justify-between py-2.5 pl-2">
        <div class="w-[80%] flex-grow flex-col items-center gap-2">
            <div
                class="inline cursor-pointer"
                @click="emit('onListClick', index)"
            >
                <h6 class="inline text-base font-bold text-[#1E293B]">{{ props?.index + 1 }}. {{ drugName }}</h6>
                <span class="text-sm font-medium text-gray-600"> ({{ genericName }}) </span>
            </div>

            <div
                v-if="durations.length > 0"
                class="block w-full"
            >
                <PrescriptionDrugPrescriptionScreenComponentFrequency
                    v-for="(duration, key) in durations"
                    :key="key"
                    :duration="duration"
                />

                <div
                    v-if="instructions.length > 0"
                    class="mt-1.5 break-all rounded-md border border-dashed border-yellow-50 bg-gray-100"
                >
                    <p
                        v-for="(instruction, index) in instructions"
                        :key="index"
                        class="mr-1.5 inline-flex break-all pl-1.5 text-sm text-slate-800"
                    >
                        {{ typeof instruction === 'object' ? instruction : instruction }}
                        <span v-if="instructions.length - 1 !== index"> ,</span>
                    </p>
                </div>
            </div>
        </div>

        <button
            type="button"
            class="cursor-pointer p-1.5"
            @click.stop="handleDeleteDrugItem(props.drug?.uuid)"
        >
            <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
        </button>
    </div>
</template>
