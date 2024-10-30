<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useField } from 'vee-validate';

const props = defineProps<{
    name?: string;
    options?: [];
    labelProp?: string;
    isLowarCase?: boolean;
    disabled?: boolean;
    keyProp?: string;
    modelValue?: any;
}>();

const { value } = useField(() => props.name);
</script>

<template>
    <Listbox
        v-slot="{ open }"
        v-model="value"
        as="div"
        class="relative w-full"
        :disabled="disabled"
    >
        <ListboxButton
            :class="[
                open
                    ? 'shodow-lg rounded-tl-md rounded-tr-md border-l border-r border-t border-blue-500'
                    : 'rounded-md border',
                disabled ? 'bg-slate-50 focus:outline-none' : 'focus:border-blue-500',
            ]"
            class="list-box-button font-poppins-regular flex h-12 w-full cursor-pointer appearance-none items-center justify-between bg-white px-3 py-3 text-xs font-medium text-gray-900 focus:outline-none focus:ring-0 2xl:text-sm"
        >
            <span class="block truncate">{{ value || 'Select' }}</span>
            <ChevronDownIcon class="h-4 w-4 text-slate-500" />
        </ListboxButton>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-out"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <ListboxOptions
                :class="open ? 'border-blue-500' : ''"
                class="absolute z-30 max-h-60 w-full overflow-auto rounded-bl-md rounded-br-md border-b border-l border-r bg-white text-base shadow-lg ring-black ring-opacity-5 scrollbar scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-sm scrollbar-w-1 focus:outline-none sm:text-sm"
            >
                <ListboxOption
                    v-for="option in options"
                    v-slot="{ active }"
                    :key="option[keyProp]"
                    :value="option[labelProp]"
                    as="template"
                >
                    <div
                        :class="active ? 'bg-blue-500 text-white' : ''"
                        class="font-poppins-regular cursor-pointer px-3 py-2 hover:bg-blue-500 hover:text-white"
                    >
                        {{ option[labelProp] }}
                    </div>
                </ListboxOption>
            </ListboxOptions>
        </transition>
    </Listbox>
</template>
