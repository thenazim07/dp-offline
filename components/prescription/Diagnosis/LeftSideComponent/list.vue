<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useDiagnosisStore } from '~/stores/prescription/useDiagnosisStore';
const useDiagnosis = useDiagnosisStore();
const { diagnosisSelectionList } = storeToRefs(useDiagnosis);
const { deleteDiagnosis, singleItemUpdate } = useDiagnosis;
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkup :list="diagnosisSelectionList">
        <template #title="diagnosis">
            <div class="pl-1">
                <div>
                    <span class="pr-1 text-slate-900">{{ diagnosis?.item?.name }}</span>
                </div>
                <div v-if="diagnosis?.item?.note">
                    <small>{{ diagnosis?.item?.note }}</small>
                </div>
            </div>
        </template>

        <template #content="diagnosis">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                :initial-values="{
                    name: diagnosis?.item?.name ?? '',
                    uuid: diagnosis?.item?.uuid ?? '',
                    ref: diagnosis?.item.ref ?? '',
                    note: diagnosis?.item?.note ?? '',
                    description: diagnosis?.item?.description ?? [],
                }"
                as="div"
            >
                <PrescriptionBaseComponentsItemMarkup>
                    <template #title>
                        <PrescriptionBaseComponentsItemName :name="diagnosis?.item?.name" />
                    </template>

                    <template #content>
                        <PrescriptionDiagnosisLeftSideComponentSingleItem
                            :field="diagnosis?.item"
                            @change-value="singleItemUpdate(values)"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMarkup>
            </VForm>
        </template>

        <template #delete="diagnosis">
            <button
                @click="deleteDiagnosis(diagnosis.item)"
                @keyup.enter="deleteDiagnosis(diagnosis.item)"
            >
                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
            </button>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkup>
</template>
