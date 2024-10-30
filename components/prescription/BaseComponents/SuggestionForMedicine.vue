<script lang="ts" setup>
import { Menu } from '@headlessui/vue';
import { storeToRefs } from 'pinia';
import { usePrescriptionPresetStore } from '~/stores/prescription/preset';
import { usePrescriptionDrugStore } from '~/stores/prescription/drug';
const presetStore = usePrescriptionPresetStore();
const { drugPresets } = storeToRefs(presetStore);
const drugStore = usePrescriptionDrugStore();
const { addNewItem } = drugStore;
const { selectedItems } = storeToRefs(drugStore);
const presetList = computed(() => (drugPresets?.value?.data ? jsonFormate(drugPresets.value?.data, 'drug_id') : []));
</script>

<template>
    <div class="flex h-full flex-col gap-5">
        <div
            v-if="presetList"
            class="flex flex-grow items-start overflow-auto rounded-md bg-slate-50 p-5 scrollbar"
        >
            <div class="flex flex-wrap">
                <Menu
                    v-for="drug in presetList"
                    :key="drug.drug_ref"
                    as="div"
                    class="relative mb-3 mr-3 inline-block text-left"
                >
                    <button
                        class="font-poppins-regular inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm focus:outline-none"
                    >
                        <PrescriptionMedicineLeftSideComponentDrugIconWithName
                            :class-name="selectedItems.includes(drug?.uuid) ? 'text-blue-500' : ' text-slate-500'"
                            :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                            :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                            :strength="drug?.strength"
                            @click="addNewItem({ ...drug })"
                        />
                    </button>
                </Menu>
            </div>
        </div>
        <slot />
    </div>
</template>
