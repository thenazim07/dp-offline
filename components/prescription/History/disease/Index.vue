<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useForm, useFieldArray } from 'vee-validate';
import type { Disease } from '~/repository/modules/EHR/DiseaseHistory/types';
import { useEhrDiseaseStore } from '~/stores/ehr/disease';
import { useConfigsStore } from '~/stores/useConfigsStore';
const { $api } = useNuxtApp();
const toast = useToast();
const useDisease = useEhrDiseaseStore();
const { searchDisease, removedDiseaseForPrescription } = useDisease;
const { diseaseSelectedList, diseaseSelectList } = storeToRefs(useDisease);
const { nonGroupHeight } = storeToRefs(useConfigsStore());

const loading = ref(false);

async function search(query: string = '') {
    if (query === '') return [];
    loading.value = true;
    const result = await searchDisease(query);
    loading.value = false;
    return result;
}

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

const { handleSubmit, values, resetForm } = useForm({
    initialValues: {
        events: diseaseSelectedList.value ?? [],
    },
});

const { remove, insert, update, fields } = useFieldArray('events');

function selectedOrUpdateDisease({ ...item }) {
    if (!item) return;
    const normalObject = copyObject(item);
    const items = deepCopyWithIndentation(values);
    if (!items.events) resetForm();
    // metch only uuid
    if (checkForDuplicate(items, item, 'events', 'Already exists')) return;

    const newObject = {
        note: normalObject.note ?? normalObject.value,
        duration: null,
        ...normalObject,
    };

    insert(0, newObject);

    const startIndex = diseaseSelectList.value.findIndex((items: any) => items === newObject.uuid);

    if (startIndex === -1) {
        diseaseSelectList.value.push(newObject.uuid);
    }
}

defineExpose({ selectedOrUpdateDisease });

const mapSelectedItem = (item: any) => ({
    icd_code_ref: item.value.icd_code_ref ?? item.value.code,
    disease: item.value.disease,
    note: item.value.note ?? '',
    duration: item.value.duration ?? null,
    duration_type: item.value.duration ? item.value.duration_type : null,
});

const mapSelectedItems = (selectedList: []) => {
    return selectedList.map(mapSelectedItem);
};

const onSubmit = handleSubmit(async (values: any) => {
    if (values.events.length === 0) return;
    try {
        const response = await $api.disease.create(getPayload('events', mapSelectedItems(fields.value)));

        if (!response?.data) return;

        response.data.forEach((item: Disease) => {
            const index = diseaseSelectedList.value.findIndex((dis: Disease) => dis.ref === item.ref);

            if (index === -1) {
                diseaseSelectedList.value = [item, ...diseaseSelectedList.value];
            } else {
                diseaseSelectedList.value.splice(index, 1, item);
            }
        });
    } catch (error) {
        toast.add({ title: error, color: 'red' });
    }
});

const removeItem = (index: any, item: any = null) => {
    remove(index);
    const itemIndex = diseaseSelectList.value.indexOf(item.uuid);
    diseaseSelectList.value.splice(itemIndex, 1);
    if (!item.ref) return;
    removedDiseaseForPrescription(item);
};

onMounted(() => {
    diseaseSelectedList.value.forEach((item: any) => {
        if (diseaseSelectList.value.includes(getUuid(item.disease))) return;
        diseaseSelectList.value.push(getUuid(item.disease));
    });
});

onUnmounted(() => {
    onSubmit();
});
</script>

<template>
    <KeepAlive>
        <div>
            <UInputMenu
                :ui="config"
                leading-icon="i-heroicons-magnifying-glass-20-solid"
                :search="search"
                :loading="loading"
                placeholder="Search/Add Personal History"
                option-attribute="title"
                leading
                trailing-icon="''"
                @update:model-value="selectedOrUpdateDisease"
            />

            <p class="text-left font-semibold text-zinc-950">List of Disease History:</p>

            <PrescriptionBaseComponentsItems :max-height="nonGroupHeight">
                <PrescriptionBaseComponentsItemMarkup
                    v-for="(field, idx) in fields"
                    :key="field.key"
                >
                    <template #title>
                        <PrescriptionBaseComponentsItemName :name="field?.value?.disease" />
                        <TrashIcon
                            class="h-5 w-5 cursor-pointer text-red-500"
                            @click="removeItem(idx, field?.value)"
                        />
                    </template>

                    <template #content>
                        <PrescriptionHistoryDiseaseSingleItem
                            :name="`events[${idx}]`"
                            :field="field"
                            :idx="idx"
                            :update="update"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMarkup>
            </PrescriptionBaseComponentsItems>
        </div>
    </KeepAlive>
</template>
