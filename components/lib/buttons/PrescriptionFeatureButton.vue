<script lang="ts" setup>
import { PlusIcon } from '@heroicons/vue/24/outline';
const props = defineProps<{
    isDisabled: false;
}>();
</script>

<template>
    <button
        :class="props.isDisabled ? 'opacity-70' : 'opacity-100'"
        class="font-poppins-semibold inline-flex items-center space-x-1 text-base font-semibold text-slate-800 hover:text-blue-500 focus:text-blue-500 focus:outline-none 2xl:text-lg"
    >
        <span>
            <slot></slot>
        </span>
        <PlusIcon class="h-5 w-5 font-semibold text-slate-900"></PlusIcon>
    </button>
</template>
