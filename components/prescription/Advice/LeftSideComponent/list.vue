<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useAdviceStore } from '~/stores/prescription/useAdviceStore';
const useAdvice = useAdviceStore();
const { adviceSelectionList } = storeToRefs(useAdvice);
const { deleteAdvice, singleItemUpdate } = useAdvice;
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkup
        :list="adviceSelectionList"
        position="right"
    >
        <template #title="advice">
            <div class="pl-1">
                <span class="pr-1">{{ advice?.item?.name }}</span>
            </div>
        </template>

        <template #content="advice">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                :initial-values="{
                    name: advice?.item?.name ?? '',
                    uuid: advice?.item?.uuid ?? '',
                    ref: advice?.item.ref ?? '',
                }"
            >
                <PrescriptionBaseComponentsItem>
                    <PrescriptionAdviceLeftSideComponentSingleItem
                        :field="advice?.item"
                        @change-value="singleItemUpdate(values)"
                    />
                </PrescriptionBaseComponentsItem>
            </VForm>
        </template>

        <template #delete="advice">
            <button
                @click="deleteAdvice(advice.item)"
                @keyup.enter="deleteAdvice(advice.item)"
            >
                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
            </button>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkup>
</template>
