i
<script lang="ts" setup>
import { Combobox, ComboboxButton, ComboboxInput } from '@headlessui/vue';
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

    isLoading: {
        type: Boolean,
        default: false,
        required: true,
    },

    isNote: {
        type: Boolean,
        default: false,
        required: false,
    },

    placeholder: {
        type: String,
        required: true,
    },
});

const $emit = defineEmits(['change']);
</script>

<template>
    <Combobox>
        <div class="relative w-full">
            <div class="relative w-full cursor-default overflow-hidden">
                <ComboboxInput
                    :placeholder="props.placeholder"
                    class="font-poppins-regular block w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm 2xl:py-3"
                    @change="$emit('change', $event.target.value)"
                    @blur="$emit('change', 'searchReset')"
                />

                <ComboboxButton class="absolute inset-y-0 left-3 flex items-center">
                    <MagnifyingGlassIcon
                        class="h-5 w-5 text-slate-500"
                        aria-hidden="true"
                    />
                </ComboboxButton>

                <ComboboxButton
                    v-if="props.isLoading"
                    class="absolute inset-y-0 right-3 flex items-center"
                >
                    <LibIconLoadingCircle></LibIconLoadingCircle>
                </ComboboxButton>
            </div>
        </div>
    </Combobox>
</template>
