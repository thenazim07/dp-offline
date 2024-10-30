<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useEhrMedicationStore } from '~/stores/ehr/medication';
const { removedMedicationForPrescription, updateMedication } = useEhrMedicationStore();
const { medicationSelectedList } = storeToRefs(useEhrMedicationStore());

const list = computed(() => {
    return (medicationSelectedList.value ?? []).map((item: any) => {
        return { ...item, unique_keys: generateRandomString(10) };
    });
});
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory
        v-if="list.length > 0"
        name="Med/H"
        :list="list"
    >
        <template #title="drug">
            <span class="mr-1 text-slate-900">
                {{ drug.item.dosage_form ? drug.item.dosage_form.short_name : '' }}
                {{ drug.item.name ? drug.item.name : drug.item.drug }} {{ drug.item.strength }}</span
            >
            <br />
            <small
                v-if="drug.item"
                class=""
            >
                {{ drug.item.frequency }}
                <span v-if="drug.item.duration"> - {{ drug.item.duration + ' ' + drug.item.duration_type }}</span>
            </small>
        </template>

        <template #content="drug">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                as="div"
                :initial-values="{
                    ref: drug?.item?.ref,
                    drug_ref: drug?.item?.drug_ref ?? '',
                    strength: drug?.item?.strength ?? '',
                    instruction: drug?.item?.instruction ?? '',
                    frequency: drug?.item?.frequency ?? '',
                    duration_type: drug?.item?.duration_type ?? '',
                    duration: drug?.item?.duration ?? null,
                }"
            >
                <PrescriptionBaseComponentsItemMedicineMarkup :drug="drug.item">
                    <template #content>
                        <PrescriptionHistoryMedicationSingleItem
                            :field="drug?.item"
                            @change-value="updateMedication(values)"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMedicineMarkup>
            </VForm>
        </template>

        <template #delete="drug">
            <button @click="removedMedicationForPrescription(drug.item)">
                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
            </button>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory>
</template>
