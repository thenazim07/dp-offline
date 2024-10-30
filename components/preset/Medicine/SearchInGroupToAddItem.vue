<script lang="ts" setup>
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    className: {
        type: String,
        default: 'py-2.5',
    },

    list: {
        type: [Object, Array],
        default: null,
        required: false,
    },

    isNote: {
        type: Boolean,
        default: false,
        required: false,
    },

    isLoading: {
        type: Boolean,
        default: false,
        required: false,
    },

    group: {
        type: Object,
        default: null,
        required: true,
    },

    placeholder: {
        type: String,
        required: true,
    },
});

const $emit = defineEmits(['selectGroupItem', 'change']);
</script>

<template>
    <section class="">
        <Combobox>
            <div class="relative mt-1">
                <div class="relative w-full cursor-default overflow-hidden">
                    <ComboboxInput
                        :placeholder="props.placeholder"
                        class="font-poppins-regular block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                        @change="$emit('change', $event.target.value)"
                    />

                    <ComboboxButton class="absolute inset-y-0 left-3 flex items-center">
                        <MagnifyingGlassIcon
                            class="h-5 w-5 text-slate-500"
                            aria-hidden="true"
                        />
                    </ComboboxButton>

                    <ComboboxButton
                        v-if="isLoading"
                        class="absolute inset-y-0 right-3 flex items-center"
                    >
                        <LibIconLoadingCircle></LibIconLoadingCircle>
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    class="absolute inset-x-0 z-30 mr-1 max-h-64 w-full overflow-y-auto rounded-b-lg bg-white py-3 shadow-xl scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
                >
                    <ComboboxOption
                        v-for="(drug, index) in list"
                        :key="index"
                        class="font-poppins-regular flex cursor-pointer items-center border-b border-slate-100 px-3.5 py-3 text-sm font-normal text-slate-800 hover:bg-slate-50"
                        :value="drug"
                        @click="
                            $emit('selectGroupItem', {
                                value: drug.drug_id,
                                ...group,
                            })
                        "
                    >
                        <div class="mr-1">
                            <PrescriptionMedicineLeftSideComponentDrugIconWithName
                                class-name="text-slate-900 font-semibold font-poppins-semibold"
                                :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                                :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                                :strength="drug?.strength"
                            />
                        </div>
                        <div>
                            <p class="font-meduim font-poppins-regular text-base text-[#136AFB80]">
                                {{ drug?.generic?.name }}
                            </p>
                        </div>
                    </ComboboxOption>
                </ComboboxOptions>
            </div>
        </Combobox>
    </section>
</template>
