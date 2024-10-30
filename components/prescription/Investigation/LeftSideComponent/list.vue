<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useInvestigationStore } from '~/stores/prescription/useInvestigationStore';
const useInvestigation = useInvestigationStore();
const { investigationSelectionList } = storeToRefs(useInvestigation);
const { deleteInvestigation, singleItemUpdate } = useInvestigation;
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkup :list="investigationSelectionList">
        <template #title="investigation">
            <div class="pl-1">
                <div>
                    <span class="pr-1 text-slate-900">{{ investigation?.item?.name }}</span>
                    <small
                        v-if="investigation?.item?.result"
                        class="capitalize"
                    >
                        ({{ investigation.item.result }} {{ investigation.item.result_unit }})
                    </small>
                </div>

                <div
                    v-if="investigation?.item?.body_position || investigation?.item?.instruction"
                    class="inline-block"
                >
                    <small v-if="investigation.item.body_position">{{ investigation.item.body_position }}</small>
                    <span v-if="investigation?.item?.body_position && investigation?.item?.instruction"> - </span>
                    <small v-if="investigation?.item?.instruction">{{ investigation.item.instruction }}</small>
                </div>
            </div>
        </template>

        <template #content="investigation">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                :initial-values="{
                    name: investigation?.item?.name ?? '',
                    uuid: investigation?.item?.uuid ?? '',
                    body_position: investigation?.item?.body_position ?? '',
                    ref: investigation?.item.ref ?? '',
                    result: investigation?.item?.result ?? '',
                    instruction: investigation?.item?.instruction ?? '',
                    description: investigation?.item?.description ?? [],
                }"
                as="div"
            >
                <PrescriptionBaseComponentsItemMarkup>
                    <template #title>
                        <PrescriptionBaseComponentsItemName :name="investigation?.item?.name" />
                    </template>

                    <template #content>
                        <PrescriptionInvestigationLeftSideComponentSingleItem
                            :field="field"
                            @change-value="singleItemUpdate(values)"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMarkup>
            </VForm>
        </template>

        <template #delete="investigation">
            <button
                @click="deleteInvestigation(investigation.item)"
                @keyup.enter="deleteInvestigation(investigation.item)"
            >
                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
            </button>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkup>
</template>
