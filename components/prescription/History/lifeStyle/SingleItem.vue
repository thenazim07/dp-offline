<script lang="ts" setup>
const props = defineProps<{
    name?: string;
    field: object | any;
    idx?: number | null;
    update?: any;
}>();

const descriptionList = computed(
    () =>
        props?.field?.value?.description?.map((item: string) => [
            {
                label: item,
                click: () => {
                    props.update(props.idx ?? 0, { ...props?.field?.value, note: item });
                },
            },
        ]) ?? [],
);

const emit = defineEmits(['change-value']);
</script>

<template>
    <div class="flex items-start space-x-4">
        <div class="w-44">
            <VField
                :name="props.name ? `${props.name}.value` : 'value'"
                class="font-poppins-regular block h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 text-base font-medium text-gray-900 focus:outline-none focus:ring-0"
                placeholder="20-20 mins/day"
                @change="emit('change-value')"
            />
        </div>

        <PrescriptionBaseComponentsDurationWithType
            :name="props.name ?? undefined"
            @change-value="emit('change-value')"
        />

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
