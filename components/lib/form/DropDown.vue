<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
    labelTitle?: string;
    options?: any | undefined;
    labelProp?: string;
    isLowarCase?: boolean;
    disabled?: boolean;
    keyProp?: string;
    modelValue?: any;
    rules?: any;
    required?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <Listbox
        v-slot="{ open }"
        :model-value="modelValue"
        by="id"
        class="relative"
        as="div"
        :disabled="disabled"
        @update:modelValue="(value: any) => emit('update:modelValue', value)"
    >
        <ListboxButton
            :class="[
                open
                    ? 'shodow-lg rounded-tl-md rounded-tr-md border-l border-r border-t border-blue-500'
                    : 'rounded-md border',
                disabled ? 'bg-slate-50 focus:outline-none' : 'focus:border-blue-500',
            ]"
            class="list-box-button flex cursor-pointer justify-between"
        >
            <div class="cursor-pointer">
                {{ modelValue.name }}
            </div>
            <ChevronDownIcon
                class="h-5 w-5 cursor-pointer text-gray-400"
                aria-hidden="true"
            />
            <label
                :class="[
                    error[0] ? 'text-red-500 peer-focus:text-red-500' : 'peer-focus:text-blue-600',
                    disabled ? 'bg-slate-50' : 'bg-white',
                ]"
                class="font-poppins-regular absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform px-2 text-[14px] text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
            >
                {{ props.labelTitle }}
                <span
                    v-if="required"
                    class="text-rose-500"
                >
                    *
                </span>
            </label>
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
                    v-for="(option, index) in options"
                    :key="index"
                    :value="option"
                    class="font-poppins-regular cursor-pointer px-3 py-2 hover:bg-blue-500 hover:text-white"
                >
                    <slot :show="option"></slot>
                </ListboxOption>
            </ListboxOptions>
        </transition>
    </Listbox>
</template>
