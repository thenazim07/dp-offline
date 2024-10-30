<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useEhrInvestigationHistoryStore } from '~/stores/ehr/investigations';

const { removedInvestigationForPrescription, updateInvestigation } = useEhrInvestigationHistoryStore();
const { investigationSelectedList } = storeToRefs(useEhrInvestigationHistoryStore());

const list = computed(() => {
    return (investigationSelectedList?.value ?? []).map((item: any) => {
        return { ...item, unique_keys: generateRandomString(10) };
    });
});
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory
        name="I/H"
        :list="list"
    >
        <template #title="investigation">
            <div class="flex items-center">
                <span class="pr-1 text-slate-900">{{ investigation?.item?.name }}</span>
                <small
                    v-if="investigation?.item?.reporting_date"
                    class="capitalize"
                >
                    ({{ useDateFormat(investigation.item.reporting_date, 'DD MMM YYYY').value }})
                </small>
            </div>
            <div
                v-if="investigation.item.value || investigation.item.note"
                class="inline-block"
            >
                <small v-if="investigation?.item?.value">
                    {{ investigation?.item?.value }}
                </small>
                <small v-if="investigation.item.note"> - {{ investigation.item.note }}</small>
            </div>
        </template>

        <template #content="investigation">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                :initial-values="{
                    name: investigation?.item?.name ?? '',
                    note: investigation?.item?.note ?? '',
                    value: investigation?.item?.value,
                    reporting_date: investigation?.item?.reporting_date,
                    ref: investigation?.item?.ref ?? investigation?.item?.ehr_ref,
                }"
                as="div"
            >
                <PrescriptionBaseComponentsItemMarkup>
                    <template #title>
                        <PrescriptionBaseComponentsItemName :name="investigation?.item?.name" />
                    </template>

                    <template #content>
                        <PrescriptionHistoryInvestigationSingleItem
                            :field="investigation.item"
                            @change-value="updateInvestigation(values)"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMarkup>
            </VForm>
        </template>

        <template #delete="investigation">
            <button @click="removedInvestigationForPrescription(investigation.item)">
                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
            </button>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory>
</template>
