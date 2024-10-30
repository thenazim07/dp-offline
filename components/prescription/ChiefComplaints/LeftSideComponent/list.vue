<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';

const useChiefComplaints = useChiefComplaintsStore();

const { deleteChiefComplaint, singleItemUpdate } = useChiefComplaints;
const { chiefComplaintsSelectionList } = storeToRefs(useChiefComplaints);
</script>

<template>
    <PrescriptionBaseComponentsSingleUpdateItemsItemMarkup :list="chiefComplaintsSelectionList">
        <template #title="chief">
            <div>
                <span class="pr-1 text-slate-900">{{ chief.item.name }}</span>
                <small
                    v-if="chief.item.duration_type"
                    class="capitalize"
                >
                    (For {{ chief.item.duration }} {{ chief.item.duration_type }})
                </small>
            </div>
            <div
                v-if="chief.item.body_position || chief.item.value"
                class="inline-block"
            >
                <small v-if="chief.item.body_position">{{ chief.item.body_position }}</small>
                <span v-if="chief.item.body_position && chief.item.value"> - </span>
                <small v-if="chief.item.value">{{ chief.item.value }}</small>
            </div>
        </template>

        <template #content="chief">
            <VForm
                v-slot="{ values }"
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                :initial-values="{
                    name: chief.item.name,
                    uuid: chief.item.uuid,
                    ref: chief.item.ref,
                    duration: chief.item.duration,
                    duration_type: chief.item.duration_type || 'days',
                    value: chief.item.value,
                    description: chief.item.description || [],
                }"
                as="div"
            >
                <PrescriptionBaseComponentsItemMarkup>
                    <template #title>
                        <PrescriptionBaseComponentsItemName :name="chief.item.name" />
                    </template>
                    <template #content>
                        <PrescriptionChiefComplaintsLeftSideComponentSingleItem
                            :field="chief.item"
                            @change-value="singleItemUpdate(values)"
                        />
                    </template>
                </PrescriptionBaseComponentsItemMarkup>
            </VForm>
        </template>

        <template #delete="chief">
            <button
                @click="deleteChiefComplaint(chief.item)"
                @keyup.enter="deleteChiefComplaint(chief.item)"
            >
                <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
            </button>
        </template>
    </PrescriptionBaseComponentsSingleUpdateItemsItemMarkup>
</template>
