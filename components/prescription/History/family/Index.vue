<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrFamilyStore } from '~/stores/ehr/family/index';
import type { Family } from '~/repository/modules/EHR/FamilyHistory/types';
import { useConfigsStore } from '~/stores/useConfigsStore';
const useFamily = useEhrFamilyStore();
const { $api } = useNuxtApp();
const { searchFamily, removedFamilyForPrescription } = useFamily;
const { familySelectedList, familySelectList } = storeToRefs(useFamily);
const toast = useToast();
const loading = ref(false);
const { nonGroupHeight } = storeToRefs(useConfigsStore());

async function search(query: string = '') {
    if (query === '') return [];
    loading.value = true;
    const result = await searchFamily(query);
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

// new code
const { handleSubmit, values, resetForm } = useForm({
    initialValues: {
        family_histories: familySelectedList.value ?? [],
    },
});

const { remove, insert, update, fields } = useFieldArray('family_histories');

function selectedOrUpdateFamily(item: any) {
    if (!item) return;
    const normalObject = copyObject(item);
    const items = deepCopyWithIndentation(values);
    if (!items.family_histories) resetForm();
    // metch only uuid
    if (checkForDuplicate(items, item, 'family_histories', 'Already exists')) return;

    insert(0, {
        note: normalObject.note ?? normalObject.value,
        relation: null,
        ...normalObject,
    });

    const startIndex = familySelectList.value.findIndex((items: any) => items === normalObject.uuid);

    if (startIndex === -1) {
        familySelectList.value.push(normalObject.uuid);
    }
}

const mapSelectedItem = (item: any) => ({
    icd_code_ref: item.value.icd_code_ref ?? item.value.code,
    disease: item.value.disease,
    note: item.value.note ?? '',
    relation: item.value.relation ?? null,
});

const mapSelectedItems = (selectedList: []) => {
    return selectedList.map(mapSelectedItem);
};

const onSubmit = handleSubmit(async (values: any) => {
    if (values.family_histories.length === 0) return;

    try {
        const response = await $api.family.create(getPayload('family_histories', mapSelectedItems(fields.value)));

        if (!response?.data) return;

        response?.data?.forEach((item: Family) => {
            const index = familySelectedList.value.findIndex(
                (family: Family) => family.icd_code_ref === item.icd_code_ref,
            );
            if (index === -1) {
                familySelectedList.value.push(item);
            } else {
                familySelectedList.value.splice(index, 1, item);
            }
        });
    } catch (error) {
        toast.add({ title: error, color: 'red' });
    }
});

const removeItem = (index: any, item: any = null) => {
    remove(index);
    const itemIndex = familySelectList.value.indexOf(item.uuid);
    familySelectList.value.splice(itemIndex, 1);
    if (!item.ref) return;
    removedFamilyForPrescription(item);
};

defineExpose({ selectedOrUpdateFamily });

onMounted(() => {
    familySelectedList.value.forEach((item: any) => {
        if (familySelectList.value.includes(getUuid(item.disease))) return;
        familySelectList.value.push(getUuid(item.disease));
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
            placeholder="Search/Add Personal History"
            option-attribute="title"
            leading
            trailing-icon="''"
            @update:model-value="selectedOrUpdateFamily"
        />

        <p class="text-left font-semibold text-zinc-950">List of Family History:</p>

        <PrescriptionBaseComponentsItems :max-height="nonGroupHeight">
            <PrescriptionBaseComponentsItemMarkup
                v-for="(field, idx) in fields"
                :key="field.key"
            >
                <template #title>
                    <PrescriptionBaseComponentsItemName :name="field?.value?.disease" />
                    <TrashIcon
                        class="h-5 w-5 cursor-pointer text-red-500"
                        @click="removeItem(idx, field.value)"
                    />
                </template>

                <template #content>
                    <PrescriptionHistoryFamilySingleItem
                        :name="`family_histories[${idx}]`"
                        :field="field"
                        :idx="idx"
                        :update="update"
                    />
                </template>
            </PrescriptionBaseComponentsItemMarkup>
        </PrescriptionBaseComponentsItems>
    </div>
</template>
