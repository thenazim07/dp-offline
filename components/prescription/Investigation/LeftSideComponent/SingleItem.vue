<script lang="ts" setup>
import { useInvestigationStore } from '~/stores/prescription/useInvestigationStore';
const useInvestigation = useInvestigationStore();
const { update } = useInvestigation;

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
                    update(props.idx ?? 0, { ...props?.field?.value, instruction: item });
                },
            },
        ]) ?? [],
);

const emit = defineEmits(['change-value']);
</script>

<template>
    <div class="flex items-start space-x-4">
        <div class="flex space-x-8">
            <PrescriptionBaseComponentsBodyPosition
                :name="props.name ?? undefined"
                @change-value="emit('change-value')"
            />

            <!-- <PrescriptionBaseComponentsResultUnitWithType
                :name="props.name ?? undefined"
                @change-value="emit('change-value')"
            /> -->

            <VField
                :id="`${props.name}.result`"
                class="placeholder-font-normal h-10 w-56 rounded-md border border-slate-200 text-gray-900 placeholder-gray-400 focus:outline-none disabled:bg-gray-100"
                type="text"
                placeholder="Ex: 1, mg/ml..."
                maxlength="50"
                :name="props.name ? `${props.name}.result` : 'result'"
                @change="emit('change-value')"
            />
        </div>

        <div class="flex flex-1 items-center">
            <div class="mr-2 flex-1">
                <PrescriptionBaseComponentsTextarea
                    :name="props.name ?? undefined"
                    textarea-name="instruction"
                    @change-value="emit('change-value')"
                />
            </div>

            <div v-if="descriptionList && descriptionList.length > 0">
                <PrescriptionBaseComponentsItemChangeNoteItem :list="descriptionList" />
            </div>
        </div>
    </div>
</template>
