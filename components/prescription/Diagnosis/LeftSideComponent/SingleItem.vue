<script lang="ts" setup>
import { useDiagnosisStore } from '~/stores/prescription/useDiagnosisStore';
const useDiagnosis = useDiagnosisStore();
const { update } = useDiagnosis;

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
                    update(props.idx ?? 0, { ...props?.field?.value, note: item });
                },
            },
        ]) ?? [],
);

const emit = defineEmits(['change-value']);
</script>

<template>
    <div class="flex items-start space-x-4">
        <div class="flex-1">
            <PrescriptionBaseComponentsTextarea
                :name="props.name ?? undefined"
                textarea-name="note"
                @change-value="emit('change-value')"
            />
        </div>

        <div v-if="descriptionList && descriptionList.length > 0">
            <PrescriptionBaseComponentsItemChangeNoteItem :list="descriptionList" />
        </div>
    </div>
</template>
