<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
const props = defineProps({
    deleteRef: {
        type: String,
        default: '',
        required: false,
    },
});
const $emit = defineEmits(['deleteItem']);
</script>

<template>
    <li class="space-y-4">
        <div class="flex w-full justify-between space-x-2 py-0.5 pr-2">
            <p
                class="before:mr- font-poppins-regular relative inline-flex items-center text-sm font-normal leading-5 text-slate-600 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod"
            >
                <slot></slot>
            </p>

            <div>
                <button @click="$emit('deleteItem', props.deleteRef)">
                    <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
                </button>
            </div>
        </div>
    </li>
</template>
