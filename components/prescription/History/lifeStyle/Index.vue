<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import type { LifeStyle } from '~/repository/modules/EHR/LifestyleHistory/types';
import { useEhrLifeStyleStore } from '~/stores/ehr/lifeStyle';
import { useConfigsStore } from '~/stores/useConfigsStore';
const useLifeStyle = useEhrLifeStyleStore();
const toast = useToast();
const { $api } = useNuxtApp();
const { lifeStyleSelectedList, lifeStyleSelectList } = storeToRefs(useLifeStyle);
const { searchLifeStyle, removedLifeStyleForPrescription } = useLifeStyle;
const { nonGroupHeight } = storeToRefs(useConfigsStore());

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

const loading = ref(false);

async function search(query: string = '') {
    if (query === '') return [];
    loading.value = true;
    const result = await searchLifeStyle(query);
    loading.value = false;
    return result;
}

const { handleSubmit, values, resetForm } = useForm({
    initialValues: {
        life_styles: lifeStyleSelectedList.value ?? [],
    },
});

const { remove, insert, update, fields } = useFieldArray('life_styles');

function selectedOrUpdateLifeStyle(item: LifeStyle) {
    if (!item) return;
    const normalObject = copyObject(item);
    const items = deepCopyWithIndentation(values);
    if (!items.life_styles) resetForm();
    // metch only uuid
    if (checkForDuplicate(items, item, 'life_styles', 'Already exists')) return;

    insert(0, {
        ...normalObject,
        type: item.type ?? item.title,
        note: '',
        value: '',
        duration: null,
        duration_type: 'day',
    });

    const startIndex = lifeStyleSelectList.value.findIndex((items: any) => items === normalObject.uuid);

    if (startIndex === -1) {
        lifeStyleSelectList.value.push(normalObject.uuid);
    }
}

const mapSelectedItem = (item: any) => ({
    life_style_type_id: item.value.life_style_type_id ?? item.value.id,
    value: item.value.value ?? null,
    duration: item.value.duration,
    duration_type: item.value.duration_type ? item.value.duration_type : '',
    note: item.value.note,
});

const mapSelectedItems = (selectedList: []) => {
    return selectedList.map(mapSelectedItem);
};

const onSubmit = handleSubmit(async (values: any) => {
    if (values.life_styles.length === 0) return;
    try {
        const response = await $api.lifeStyle.create_life_style(
            getPayload('life_styles', mapSelectedItems(fields.value)),
        );

        if (!response?.data) return;

        response?.data?.forEach((item) => {
            const index = lifeStyleSelectedList.value.findIndex(
                (life) => life.life_style_type_id === item.life_style_type_id,
            );
            if (index === -1) {
                lifeStyleSelectedList.value.push(item);
            } else {
                lifeStyleSelectedList.value.splice(index, 1, item);
            }
        });
    } catch (error) {
        toast.add({ title: error?.data?.message, color: 'red' });
    }
});

const removeItem = (index: any, item: any = null) => {
    remove(index);
    const itemIndex = lifeStyleSelectList.value.indexOf(item.uuid);
    lifeStyleSelectList.value.splice(itemIndex, 1);
    if (!item.ref) return;
    removedLifeStyleForPrescription(item);
};

defineExpose({ selectedOrUpdateLifeStyle });

onMounted(() => {
    lifeStyleSelectedList.value.forEach((item: any) => {
        if (lifeStyleSelectedList.value.includes(getUuid(item.type))) return;
        lifeStyleSelectList.value.push(getUuid(item.type));
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
            placeholder="Search/Add LifeStyle"
            option-attribute="title"
            leading
            trailing-icon="''"
            @update:model-value="selectedOrUpdateLifeStyle"
        />

        <p class="text-left font-semibold text-zinc-950">List of Lifestyle History:</p>

        <PrescriptionBaseComponentsItems :max-height="nonGroupHeight">
            <PrescriptionBaseComponentsItemMarkup
                v-for="(field, idx) in fields"
                :key="field.key"
            >
                <template #title>
                    <PrescriptionBaseComponentsItemName :name="field?.value?.type" />
                    <TrashIcon
                        class="h-5 w-5 cursor-pointer text-red-500"
                        @click="removeItem(idx, field.value)"
                    />
                </template>

                <template #content>
                    <PrescriptionHistoryLifeStyleSingleItem
                        :name="`life_styles[${idx}]`"
                        :field="field"
                        :idx="idx"
                        :update="update"
                    />
                </template>
            </PrescriptionBaseComponentsItemMarkup>
        </PrescriptionBaseComponentsItems>
    </div>
</template>
