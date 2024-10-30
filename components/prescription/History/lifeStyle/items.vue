<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useEhrLifeStyleStore } from '~/stores/ehr/lifeStyle';
const { removedLifeStyleForPrescription, updateLifeStyle } = useEhrLifeStyleStore();
const { lifeStyleSelectedList } = storeToRefs(useEhrLifeStyleStore());

const list = computed(() => {
    return (lifeStyleSelectedList.value ?? []).map((item: any) => {
        return { ...item, unique_keys: generateRandomString(10) };
    });
});
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory
        name="P/H"
        :list="list"
    >
        <template #title="lifeStyle">
            <span class="text-slate-900">{{ lifeStyle.item.type }}</span>
            <small
                v-if="lifeStyle.item.value || lifeStyle.item.note"
                class="mr-1"
            >
                - {{ lifeStyle.item.value }}
                <span v-if="lifeStyle.item.duration">
                    / {{ lifeStyle.item.duration }} {{ lifeStyle.item.duration_type }}
                </span>
            </small>
            <br v-if="lifeStyle.item.note" />
            <small v-if="lifeStyle.item.note">{{ lifeStyle.item.note }}</small>
        </template>

        <template #content="lifeStyle">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                as="div"
                :initial-values="{
                    life_style_type_id: lifeStyle?.item?.life_style_type_id ?? lifeStyle?.item?.id,
                    value: lifeStyle?.item?.value ?? '',
                    duration: lifeStyle?.item?.duration ?? null,
                    note: lifeStyle?.item?.note ?? '',
                    duration_type: lifeStyle?.item?.duration_type ?? null,
                }"
            >
                <PrescriptionBaseComponentsItemMarkup>
                    <template #title>
                        <PrescriptionBaseComponentsItemName :name="lifeStyle?.item?.type" />
                    </template>

                    <template #content>
                        <PrescriptionHistoryLifeStyleSingleItem
                            :field="lifeStyle?.item"
                            @change-value="updateLifeStyle(values)"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMarkup>
            </VForm>
        </template>

        <template #delete="lifeStyle">
            <div>
                <button @click="removedLifeStyleForPrescription(lifeStyle.item)">
                    <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
                </button>
            </div>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkupHistory>
</template>
