<script lang="ts" setup>
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    TransitionRoot,
} from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
    labelTitle?: string;
    name?: string;
    options?: [];
    error?: [];
    labelProp?: string;
    isLowarCase?: boolean;
    disabled?: boolean;
    keyProp?: string;
    modelValue?: any;
    rules?: any;
    isMultiple?: boolean;
    required?: boolean;
    placeholder?: string;
    value?: string;
    className: string;
}>();

const query = ref('');
const whenEnterKeyPress = () => {
    emit('update:modelValue', query.value);
    query.value = '';
};

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <Combobox
        v-slot="{ open }"
        as="div"
        :name="name"
        class="relative w-full"
        :multiple="props.isMultiple"
    >
        <div
            class="relative w-full cursor-default overflow-hidden"
            :class="
                open
                    ? 'shodow-lg rounded-tl-md rounded-tr-md border-l border-r border-t border-blue-500'
                    : 'rounded-md border'
            "
        >
            <ComboboxButton
                class="w-full bg-white"
                as="div"
            >
                <ComboboxInput
                    :value="value"
                    class="h-10 w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    :placeholder="placeholder"
                    @change="query = $event.target.value"
                    @keyup.enter="whenEnterKeyPress"
                />
                <div class="absolute inset-y-0 right-0 flex h-11 items-center pr-2">
                    <ChevronDownIcon
                        class="h-5 w-5 cursor-pointer text-gray-400"
                        aria-hidden="true"
                    />
                </div>
            </ComboboxButton>
        </div>

        <TransitionRoot
            leave="transition ease-in duration-100"
            leave-from="opacity-100"
            leave-to="opacity-0"
            @after-leave="query = ''"
        >
            <div
                :class="open ? 'border-blue-500' : ''"
                class="å absolute z-30 w-full"
            >
                <ComboboxOptions
                    :class="open ? 'border-blue-500' : ''"
                    class="z-30 h-36 w-full overflow-auto rounded-bl-md rounded-br-md border-b border-l border-r bg-white pr-2 text-base shadow-lg ring-black ring-opacity-5 scrollbar scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-sm scrollbar-w-1 scrollbar-h-12 focus:outline-none sm:text-sm 2xl:max-h-60"
                >
                    <ComboboxOption
                        v-for="(option, index) in options"
                        :key="index"
                        v-slot="{ active }"
                        :value="option"
                    >
                        <slot
                            :show="option"
                            :active="active"
                        ></slot>
                    </ComboboxOption>
                </ComboboxOptions>
            </div>
        </TransitionRoot>
    </Combobox>
</template>
