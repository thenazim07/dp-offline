<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
    title: string;
}>();

const emit = defineEmits<{
    (e: 'modal:close', value: boolean): boolean;
}>();
</script>

<template>
    <div class="mb-8 flex items-center justify-between pt-6">
        <h3 class="text-lg font-medium text-slate-800 2xl:text-xl">
            {{ props.title }}
        </h3>
        <button
            type="button"
            class="group absolute right-1 top-1 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 p-1.5 text-gray-600 ring-1 ring-transparent ring-opacity-25 hover:bg-slate-200 hover:ring-red-200"
            @click="emit('modal:close')"
        >
            <XMarkIcon class="h-6 w-6 group-hover:text-red-500"></XMarkIcon>
        </button>
    </div>
</template>
