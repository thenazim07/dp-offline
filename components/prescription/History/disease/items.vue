<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import type { Disease } from '~/repository/modules/EHR/DiseaseHistory/types';
import { useEhrDiseaseStore } from '~/stores/ehr/disease';
const { removedDiseaseForPrescription, updateDisease } = useEhrDiseaseStore();
const { diseaseSelectedList } = storeToRefs(useEhrDiseaseStore());

const diseaseData = computed(() => {
    return (diseaseSelectedList?.value ?? []).map((item: Disease) => {
        return { ...item, unique_keys: generateRandomString(10) };
    });
});
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory
        name="D/H"
        :list="diseaseData"
    >
        <template #title="disease">
            <span class="mr-1 text-slate-900">{{ disease?.item?.disease }} </span>
            <small
                v-if="disease?.item?.duration"
                class="capitalize"
            >
                (For {{ disease?.item?.duration }} {{ disease?.item?.duration_type }})
            </small>
            <br v-if="disease?.item?.note" />
            <small
                v-if="disease?.item?.note"
                class=""
            >
                {{ disease?.item?.note }}
            </small>
        </template>

        <template #content="disease">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                :initial-values="{
                    disease: disease?.item?.disease ?? '',
                    uuid: disease?.item?.uuid ?? '',
                    icd_code_ref: disease?.item?.icd_code_ref ?? '',
                    item_id: disease?.item?.item_id ?? '',
                    duration: disease?.item?.duration ?? '',
                    duration_type: disease?.item?.duration_type ?? 'days',
                    note: disease?.item?.note ?? '',
                    description: disease?.item?.description ?? [],
                }"
                as="div"
            >
                <PrescriptionBaseComponentsItemMarkup>
                    <template #title>
                        <PrescriptionBaseComponentsItemName :name="disease?.item?.disease" />
                    </template>

                    <template #content>
                        <PrescriptionHistoryDiseaseSingleItem
                            :field="disease?.item"
                            @change-value="updateDisease(values)"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMarkup>
            </VForm>
        </template>

        <template #delete="disease">
            <button @click="removedDiseaseForPrescription(disease.item)">
                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
            </button>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory>
</template>
