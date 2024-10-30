<script lang="ts" setup>
import type { IDrag } from '~/repository/modules/Prescription/DrugsModule/types';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
// import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
// const prescriptionDrugStore = usePrescriptionDrugStore()
import { useEhrDrugStoreRoot } from '~/stores/ehr/useDrugStoreRoot';
import type { IPastDrug } from '~/repository/modules/EHR/PastDrugHistory/types';
import { usePrescriptionDrugFrequenciesStore } from '~/stores/prescription/useDrugStore/frequencies';
const ehrDrugStoreRoot = useEhrDrugStoreRoot();

// preset
const presetStore = usePrescriptionPresetStore();
const { drugPresets } = storeToRefs(presetStore);
const prescriptionDrugFrequencyStore = usePrescriptionDrugFrequenciesStore();

const presetList = computed(() => {
    const data = drugPresets.value?.data ?? [];
    return data ? jsonFormate(data, 'drug_id') : [];
});

function addNewDrugHandler(drug: IPastDrug) {
    if (ehrDrugStoreRoot.isAlreadySelected(drug.name)) return;
    ehrDrugStoreRoot.addNewDrug({
        name: generateDrugUniqName(drug, true),
        drug_ref: drug.drug_ref,
    });
}

onMounted(() => {
    prescriptionDrugFrequencyStore.getFrequencies();
    presetStore.fetchPresetData('medicine');
});
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
                :class-name="ehrDrugStoreRoot.isAlreadySelected(drug.name) ? 'text-blue-500' : ' text-slate-500'"
                :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                :strength="drug?.strength"
                @click="addNewDrugHandler(drug)"
            />
        </button>
    </div>
</template>
