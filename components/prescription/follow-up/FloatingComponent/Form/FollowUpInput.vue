<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useConfigsStore } from '~/stores/useConfigsStore';
import type { IIndication } from '~/repository/modules/Prescription/IndicationModule/types';
import { useDiagnosisStoreRoot } from '~/stores/prescription/useDiagnosisStoreRoot';
import type { IDiagnosis } from '~/repository/modules/Prescription/DiagnosisModule/type';
const { durationTypes } = storeToRefs(useConfigsStore());

const diagnosisStoreRoot = useDiagnosisStoreRoot();

const { loading, search } = await useDiagnosisSearch();

const props = withDefaults(
    defineProps<{
        diagnosis?: IDiagnosis;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        diagnosis: () => ({}) as IDiagnosis,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

const name = computed({
    get: () => props.diagnosis.name,
    set: (value) => diagnosisStoreRoot.updateDiagnosis(props.index!, 'name', value),
});

const note = computed({
    get: () => props.diagnosis.note,
    set: (value) => diagnosisStoreRoot.updateDiagnosis(props.index!, 'note', value),
});

function deleteItem() {
    diagnosisStoreRoot.deleteDiagnosis(props.index!);
}
</script>

<template>
    <div class="flex w-full items-center justify-between gap-1">
        <div class="relative w-[40%]">
            <!-- <input
                    type="text"
                    class="w-full rounded border-none p-3"
                    placeholder="Enter complaints"
                /> -->
            <PrescriptionBaseComponentsSearch
                v-model:query="name"
                :search="search"
                :loading="loading"
                option-attribute="name"
                :autofocus="autofocus"
                placeholder="Search/Add diagnosis"
                @select-item="diagnosisStoreRoot.updateDiagnosis(props.index!, 'name', $event.name)"
            />
            <!-- @select-item="addNewItem" -->
            <!-- @custom-create="customItemAdd" -->
        </div>

        <div class="flex flex-grow">
            <textarea
                v-model="note"
                placeholder="Note"
                rows="1"
                class="w-full resize-none rounded border-none px-2 py-3"
                @keydown.enter.exact.prevent
            ></textarea>
        </div>

        <div
            v-if="props.isRemovable"
            class="w-[3%]"
        >
            <button
                type="button"
                @click.prevent="deleteItem"
            >
                <TrashIcon class="h-6 w-6 font-semibold text-red-600" />
            </button>
        </div>
        <div
            v-else
            class="w-[3.5%]"
        ></div>
    </div>
</template>
