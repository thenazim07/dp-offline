<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useEhrMedicationStore } from '~/stores/ehr/medication';
import { usePrescriptionDrugStore } from '~/stores/prescription/drug/index';

import { useConfigsStore } from '~/stores/useConfigsStore';
const useDrug = usePrescriptionDrugStore();
const medication = useEhrMedicationStore();
const { initialize, searchDrug } = useDrug;
const { medicationSelectedList, medicationSelectList } = storeToRefs(medication);
const { removedMedicationForPrescription } = medication;
initialize();
const { nonGroupHeight } = storeToRefs(useConfigsStore());

const { $api } = useNuxtApp();
const toast = useToast();
const loading = ref(false);

const config = {
    wrapper: 'mb-4',
    base: 'block w-full ring-0 shadow-none rounded-lg border focus:border-blue-500 border-slate-300 bg-white  font-poppins-regular leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm',
    padding: 'py-3 pl-10 pr-3',
    color: {
        white: {
            outline: 'shadow-none ring-0 focus:ring-0 focus:outline-border-blue-600 focus:ring-blue-600',
        },
    },
};

async function search(query: string = '') {
    if (query === '') return [];
    loading.value = true;
    const result = await searchDrug(query);
    loading.value = false;
    return result;
}

const { handleSubmit, values, resetForm } = useForm({
    initialValues: {
        past_drugs: medicationSelectedList.value ?? [],
    },
});

const { remove, insert, update, fields } = useFieldArray('past_drugs');

function selectedOrUpdateMedicine(item: any) {
    if (!item) return;
    const normalObject = copyObject(item);
    const items = deepCopyWithIndentation(values);
    if (!items.past_drugs) resetForm();
    // metch only uuid
    if (checkForDuplicate(items, item, 'past_drugs', 'Already exists')) return;

    insert(0, {
        ...normalObject,
        frequency: '',
        duration_type: 'days',
        duration: null,
    });

    const startIndex = medicationSelectList.value.findIndex((items: any) => items === normalObject.drug_ref);

    if (startIndex === -1) {
        medicationSelectList.value.push(normalObject.drug_ref);
    }
}

const mapSelectedItem = (drug: any) => ({
    type: 'brand',
    name: drug.value.name,
    drug_ref: drug.value.drug_ref ?? drug.value.ref,
    strength: drug.value.strength ? drug.value.strength : '',
    instruction: drug.value.instruction ? drug.value.instruction : '',
    frequency: drug.value.frequency ? drug.value.frequency : null,
    duration_type: drug.value.duration_type ?? '',
    duration: drug.value.duration ? Number(drug.value.duration) : null,
});

const mapSelectedItems = (selectedList: []) => {
    return selectedList.map(mapSelectedItem);
};

const onSubmit = handleSubmit(async (values: any) => {
    if (values.past_drugs.length === 0) return;

    try {
        const response = await $api.pastDrug.createPastDrugHistoryMultiple(
            getPayload('drugs', mapSelectedItems(fields.value)),
        );
        if (!response?.data) return;
        medicationSelectedList.value = [];
        medicationSelectedList.value = response.data;
    } catch (error) {
        toast.add({ title: error, color: 'red' });
    }
});

const removeItem = (index: any, item: any = null) => {
    remove(index);
    const itemIndex = medicationSelectList.value.indexOf(item.drug_ref);
    medicationSelectList.value.splice(itemIndex, 1);
    if (!item.ref) return;
    removedMedicationForPrescription(item);
};

defineExpose({ selectedOrUpdateMedicine });

onMounted(() => {
    medicationSelectedList.value.forEach((item: any) => {
        if (medicationSelectList.value.includes(item.drug_ref)) return;
        medicationSelectList.value.push(item.drug_ref);
    });
});

onUnmounted(() => {
    onSubmit();
});
</script>

<template>
    <div>
        <UInputMenu
            :ui="config"
            leading-icon="i-heroicons-magnifying-glass-20-solid"
            :search="search"
            :loading="loading"
            placeholder="Search by brand or generic name"
            option-attribute="title"
            leading
            trailing-icon="''"
            @update:model-value="selectedOrUpdateMedicine"
        >
            <template #option="{ option: drug }">
                <li class="flex items-center space-x-2">
                    <PrescriptionMedicineLeftSideComponentDrugIconWithName
                        class-name="text-slate-900 font-semibold font-poppins-semibold"
                        :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                        :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                        :strength="drug?.strength"
                    />
                    <p class="font-meduim font-poppins-regular text-base text-[#136AFB80]">
                        {{ drug?.generic?.name }}
                    </p>
                </li>
            </template>
        </UInputMenu>

        <p class="text-left font-semibold text-zinc-950">List of Medication History:</p>

        <PrescriptionBaseComponentsItems :max-height="nonGroupHeight">
            <PrescriptionBaseComponentsItemMedicineMarkup
                v-for="(field, idx) in fields"
                :key="field.key"
                :drug="field.value"
            >
                <template #action>
                    <TrashIcon
                        class="h-5 w-5 cursor-pointer text-red-500"
                        @click="removeItem(idx, field.value)"
                    />
                </template>

                <template #content>
                    <PrescriptionHistoryMedicationSingleItem
                        :name="`past_drugs[${idx}]`"
                        :field="field"
                        :idx="idx"
                        :update="update"
                    />
                </template>
            </PrescriptionBaseComponentsItemMedicineMarkup>
        </PrescriptionBaseComponentsItems>
    </div>
</template>
