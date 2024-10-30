<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrInvestigationHistoryStore } from '~/stores/ehr/investigations';
import type { Investigation } from '~/repository/modules/EHR/InvestigationsHistory/types';
import { useConfigsStore } from '~/stores/useConfigsStore';
const useInvestigation = useEhrInvestigationHistoryStore();
const { searchInvestigation, setInvestgationCreateData, removedInvestigationForPrescription } = useInvestigation;
const { investigationSelectedList, investigationSelectList } = storeToRefs(useInvestigation);
const { $api } = useNuxtApp();
const toast = useToast();
const loading = ref(false);
const { nonGroupHeight } = storeToRefs(useConfigsStore());

async function search(query: string = '') {
    if (query === '') return [];
    loading.value = true;
    const result = await searchInvestigation(query);
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
        investigations: investigationSelectedList.value ?? [],
    },
});

const { remove, insert, update, fields } = useFieldArray('investigations');

function selectedOrUpdateInvestigation(item: Investigation) {
    if (!item) return;
    const normalObject = copyObject(item);
    const items = deepCopyWithIndentation(values);
    if (!items.investigations) resetForm();
    if (checkForDuplicate(items, item, 'investigations', 'Already exists')) return;

    insert(0, {
        ...normalObject,
        value: null,
        note: normalObject?.note ?? normalObject?.des,
    });

    const startIndex = investigationSelectedList.value.findIndex((items: any) => items === normalObject.uuid);

    if (startIndex === -1) {
        investigationSelectList.value.push(normalObject.uuid);
    }
}

const mapSelectedItem = (item: Investigation) => ({
    name: item?.value?.name,
    ref: item?.value?.ref ?? item?.value?.diagnostic_ref,
    value: item?.value?.value ?? '',
    reporting_date: item?.value?.reporting_date ? useDateFormat(item?.value?.reporting_date, 'YYYY-MM-DD').value : null,
    note: item?.value?.note ?? '',
});

const mapSelectedItems = (selectedList: []) => {
    return selectedList.map(mapSelectedItem);
};

const onSubmit = handleSubmit(async (values: any) => {
    if (values.investigations.length === 0) return;
    try {
        const response = await $api.investigationHistory.create(
            getPayload('investigations', mapSelectedItems(fields.value)),
        );
        if (response) {
            setInvestgationCreateData(response.data);
            resetForm();
            return true;
        }
    } catch (error) {
        toast.add({ title: error, color: 'red' });
    }
});

const removeItem = (index: any, item: any = null) => {
    remove(index);
    const itemIndex = investigationSelectList.value.indexOf(item.uuid);
    investigationSelectList.value.splice(itemIndex, 1);
    if (!item.ehr_ref) return;
    removedInvestigationForPrescription(item);
};

defineExpose({ selectedOrUpdateInvestigation });

onMounted(() => {
    investigationSelectedList.value.forEach((item: any) => {
        if (investigationSelectedList.value.includes(getUuid(item.name))) return;
        investigationSelectList.value.push(getUuid(item.name));
    });
});

onUnmounted(() => {
    onSubmit();
});
</script>

<template>
    <div id="date">
        <UInputMenu
            :ui="config"
            leading-icon="i-heroicons-magnifying-glass-20-solid"
            :search="search"
            :loading="loading"
            placeholder="Search/Add Investigation"
            option-attribute="name"
            leading
            trailing-icon="''"
            @update:model-value="selectedOrUpdateInvestigation"
        />

        <p class="text-left font-semibold text-zinc-950">List of Investigation History:</p>

        <PrescriptionBaseComponentsItems :max-height="nonGroupHeight">
            <PrescriptionBaseComponentsItemMarkup
                v-for="(field, idx) in fields"
                :key="field.key"
            >
                <template #title>
                    <PrescriptionBaseComponentsItemName :name="field?.value?.name" />
                    <TrashIcon
                        class="h-5 w-5 cursor-pointer text-red-500"
                        @click="removeItem(idx, field.value)"
                    />
                </template>

                <template #content>
                    <PrescriptionHistoryInvestigationSingleItem
                        :name="`investigations[${idx}]`"
                        :field="field"
                        :idx="idx"
                        :update="update"
                    />
                </template>
            </PrescriptionBaseComponentsItemMarkup>
        </PrescriptionBaseComponentsItems>
    </div>
</template>

<style>
#date .dp__menu.dp__menu_index.dp__theme_light {
    position: fixed !important;
}
</style>
