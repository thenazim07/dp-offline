<script lang="ts" setup>
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';
const useChiefComplaints = useChiefComplaintsStore();
const { update } = useChiefComplaints;

const props = defineProps<{
    name?: string;
    field: object | any;
    idx?: number | null;
}>();

const descriptionList = computed(
    () =>
        props?.field?.value?.description?.map((item: string) => [
            {
                label: item,
                click: () => {
                    update(props.idx ?? 0, { ...props?.field?.value, value: item });
                },
            },
        ]) ?? [],
);

const emit = defineEmits(['change-value']);
</script>

<template>
    <div class="flex items-start space-x-4">
        <PrescriptionBaseComponentsDurationWithType
            :name="props.name ?? undefined"
            @change-value="emit('change-value')"
        />

        <div class="flex flex-1">
            <div class="mr-2 flex-1">
                <PrescriptionBaseComponentsTextarea
                    :name="props.name ?? undefined"
                    textarea-name="value"
                    @change-value="emit('change-value')"
                />
            </div>
            <div v-if="descriptionList && descriptionList.length > 0">
                <PrescriptionBaseComponentsItemChangeNoteItem :list="descriptionList" />
            </div>
        </div>
    </div>
</template>
