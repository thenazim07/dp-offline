<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    name: {
        type: [String, Number],
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div class="cursor-pointer">
        {{ props.name }}
    </div>

    <ChevronDownIcon
        class="h-5 w-5 cursor-pointer text-gray-400"
        aria-hidden="true"
    />

    <label
        :class="false ? 'text-red-500 peer-focus:text-red-500' : 'peer-focus:text-blue-600'"
        class="font-poppins-regular absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-[14px] text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
    >
        <slot></slot>
        <span
            v-if="required"
            class="text-rose-500"
        >
            *
        </span>
    </label>
</template>
