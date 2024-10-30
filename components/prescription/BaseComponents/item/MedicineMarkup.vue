<script lang="ts" setup>
export interface Props {
    name?: string;
    drug?: object | any | undefined;
    isSelected?: boolean;
    isShowTitle?: boolean;
    isError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    name: undefined,
    drug: null,
    isSelected: false,
    isShowTitle: true,
    isError: false,
});

const isSelectedStyle = computed(() => {
    return props.isError
        ? props.isSelected
            ? 'ring-red-500'
            : 'ring-transparent'
        : props.isSelected && props?.drug?.drug_id
          ? 'ring-blue-500'
          : 'text-slate-500 ring-transparent border-slate-200 ';
});

const isCustomMedicine = computed(() => props?.drug?.is_custom_drug || false);
const emit = defineEmits(['change-value']);
</script>

<template>
    <div
        class="w-full cursor-pointer rounded-lg bg-slate-100 px-3 py-3 ring-1 transition duration-500"
        :class="isSelectedStyle"
    >
        <div class="mb-1.5 flex w-full items-center justify-between">
            <template v-if="!isCustomMedicine">
                <div class="flex w-full items-center">
                    <div class="mr-3">
                        <img
                            class="h-5 w-5 text-slate-300"
                            :src="props.drug?.dosage_form?.icon_url"
                            :alt="props.drug?.dosage_form?.name"
                        />
                    </div>

                    <button class="flex items-center">
                        <p class="font-poppins-regular font-normal text-slate-500">
                            <strong class="font-poppins-semibold mr-0.5 font-semibold text-slate-800">
                                {{ props.drug?.dosage_form?.short_name }}
                                {{ props.drug?.brand_name ?? props.drug?.name ?? props.drug?.drug }}
                            </strong>
                            <span>{{ props.drug?.strength }}</span>
                        </p>
                        <!-- <ChevronDownIcon class="ml-1.5 h-5 w-5" /> -->
                    </button>
                    <!--popover-->
                </div>
            </template>

            <template v-if="isCustomMedicine">
                <LazyPrescriptionBaseComponentsCustomMedicineSections
                    :name="props.name"
                    :drug="props?.drug"
                    @change-value="emit('change-value')"
                />
            </template>
            <slot name="action"></slot>
        </div>
        <slot name="content"></slot>
    </div>
</template>
