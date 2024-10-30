i
<script lang="ts" setup>
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    TransitionRoot,
} from '@headlessui/vue';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/solid';

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

    identicalName: {
        type: String,
        default: '',
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

const query = ref('');
const hasFound = computed(() => props.list?.length === 0 && query.value !== '');
const $emit = defineEmits(['selectedItem', 'change']);
const searchQuery = (value: string) => (query.value = value);
const onSelecte = (value: any) => {
    $emit('selectedItem', value);
    query.value = '';
};
const onCreate = () => {
    $emit('selectedItem', { name: query.value, id: null });
    query.value = '';
};
</script>

<template>
    <section class="mb-4 2xl:mb-8">
        <Combobox
            :model-value="query"
            @update:modelValue="(value: any) => onSelecte(value)"
        >
            <div class="relative mt-1">
                <div class="f relative w-full cursor-default overflow-hidden">
                    <ComboboxInput
                        :placeholder="placeholder"
                        class="font-poppins-regular block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm 2xl:py-3"
                        @change="
                            {
                                searchQuery($event.target.value), $emit('change', $event.target.value);
                            }
                        "
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

                    <ComboboxButton
                        v-if="!isLoading && hasFound"
                        class="absolute inset-y-0 right-3 flex items-center"
                    >
                        <button
                            class="flex h-6 w-6 items-center justify-center rounded-full bg-skin-button-accent text-center ring ring-transparent hover:ring-blue-200 2xl:h-8 2xl:w-8"
                            @click.enter="onCreate"
                        >
                            <PlusIcon class="h-6 w-6 text-white"></PlusIcon>
                        </button>
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    class="absolute inset-x-0 z-30 mr-1 max-h-64 w-full overflow-y-auto rounded-b-lg bg-white py-3 shadow-xl scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
                >
                    <div
                        v-if="hasFound"
                        class="font-poppins-regular relative cursor-default select-none px-4 py-2 text-center italic text-gray-700"
                    >
                        Nothing found.
                    </div>

                    <TransitionRoot
                        leave="transition ease-in duration-100"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                        @after-leave="query = ''"
                    >
                        <ComboboxOption
                            v-for="(item, index) in list"
                            :key="index"
                            v-slot="{ selected, active }"
                            as="template"
                            :value="item"
                        >
                            <li
                                :class="{
                                    'bg-slate-50 text-slate-800': active,
                                    'text-gray-600': !active,
                                }"
                                class="font-poppins-regular cursor-pointer border-b border-slate-100 px-3.5 py-2.5 text-sm font-normal text-slate-800 hover:bg-slate-50 2xl:py-3.5"
                                @click="onSelecte(item)"
                            >
                                <span
                                    class="block truncate"
                                    :class="{ 'font-medium': selected, 'font-normal': !selected }"
                                >
                                    {{ isNote ? item?.content : item.name }}
                                </span>
                            </li>
                        </ComboboxOption>
                    </TransitionRoot>
                </ComboboxOptions>
            </div>
        </Combobox>
    </section>
</template>
