<script lang="ts" setup>
import type { IDrag } from '~/repository/modules/Prescription/DrugsModule/types';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
const prescriptionDrugStore = usePrescriptionDrugStore();

// preset
const presetStore = usePrescriptionPresetStore();
const { drugPresets } = storeToRefs(presetStore);
const { mostUsedDrugs } = storeToRefs(prescriptionDrugStore);

const presetList = computed(() => {
    const data = drugPresets.value?.data ?? [];
    return data ? jsonFormate(data, 'drug_id') : [];
});

function addNewDrugHandler(drug: IDrag): void {
    if (prescriptionDrugStore.isAlreadySelected(drug)) return;
    prescriptionDrugStore.addMoreDrug(drug);
}

const mostUsedDrugsFilteredByPresetDuplication = computed(() =>
    mostUsedDrugs?.value?.filter(
        (mostUsedDrug) => presetList?.value?.findIndex((preset: any) => mostUsedDrug.name === preset.name) === -1,
    ),
);
</script>

<template>
    <div
        v-for="drug in presetList"
        :key="drug.drug_ref"
        class="relative mb-3 mr-3 inline-block text-left"
    >
        <button
            class="font-poppins-regular inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none"
        >
            <PrescriptionDrugIconWithName
                :class-name="prescriptionDrugStore.isAlreadySelected(drug) ? 'text-blue-500' : ' text-slate-500'"
                :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                :strength="drug?.strength"
                @click="addNewDrugHandler(drug)"
            />
        </button>
    </div>

    <div
        v-for="drug in mostUsedDrugsFilteredByPresetDuplication"
        :key="drug.drug_id"
        class="relative mb-3 mr-3 inline-block text-left"
    >
        <button
            class="font-poppins-regular inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none"
        >
            <PrescriptionDrugIconWithName
                :class-name="prescriptionDrugStore.isAlreadySelected(drug) ? 'text-blue-500' : ' text-slate-500'"
                :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                :strength="drug?.strength"
                @click="addNewDrugHandler(drug)"
            />
        </button>
    </div>
</template>
