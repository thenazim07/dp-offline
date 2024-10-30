<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps<{
    name?: string;
    field: object | any;
    idx?: number | null;
    update?: any;
}>();

const list = computed(() => {
    if (Array.isArray(props?.field?.value?.description)) {
        return props?.field?.value?.description;
    }
    return [];
});

const descriptionList = computed(
    () =>
        list?.value?.map((item: string) => [
            {
                label: item,
                click: () => {
                    props.update(props.idx ?? 0, { ...props?.field?.value, note: item });
                },
            },
        ]) ?? [],
);

const emit = defineEmits(['change-value']);
const dateValue = ref(props.field?.value?.reporting_date ?? props.field?.reporting_date);
</script>

<template>
    <div class="flex items-start space-x-4">
        <VField
            v-slot="{ field: fieldInput }"
            class="inv h-10 w-44 text-xs"
            :name="props.name ? `${props.name}.reporting_date` : 'reporting_date'"
            as="div"
        >
            <VueDatePicker
                v-model="dateValue"
                :enable-time-picker="false"
                v-bind="fieldInput"
                placeholder="Date"
                :max-date="new Date()"
                @update:model-value="emit('change-value')"
            >
            </VueDatePicker>
        </VField>

        <!-- <PrescriptionBaseComponentsResultUnitWithType
            :name="props.name ?? undefined"
            @change-value="emit('change-value')"
        /> -->

        <VField
            :id="`${props.name}.value`"
            class="placeholder-font-normal h-10 w-56 rounded-md border border-slate-200 text-gray-900 placeholder-gray-400 focus:outline-none disabled:bg-gray-100"
            type="text"
            placeholder="Ex: 1, mg/ml..."
            :name="props.name ? `${props.name}.value` : 'value'"
            maxlength="50"
            @change="emit('change-value')"
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

<style>
.dp__pointer.dp__input_readonly.dp__input.dp__input_icon_pad.dp__input_reg {
    @apply text-sm;
}

.inv .dp__pointer.dp__input_readonly.dp__input.dp__input_icon_pad.dp__input_reg {
    height: 40px !important;
}

.custom-month-year-component {
    display: flex;
    align-items: center;
    margin: 0 auto;
}

.select-input {
    margin: 5px 3px;
    padding: 5px;
    width: auto;
    border-radius: 4px;
    border-color: var(--dp-border-color);
    outline: none;
    -webkit-appearance: menulist;
}

.icons {
    display: flex;
    box-sizing: border-box;
}
</style>
