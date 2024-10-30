<script lang="ts" setup>
import { DialogTitle } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
});

const $emit = defineEmits(['close']);
</script>

<template>
    <ClientOnly>
        <DialogTitle>
            <p class="font-poppins-regular text-lg font-normal text-slate-800 2xl:text-2xl">
                {{ props.title }}
            </p>
        </DialogTitle>

        <div class="absolute right-2 top-2">
            <XMarkIcon
                class="h-5 w-5 cursor-pointer text-slate-500"
                @click="$emit('close', false)"
            ></XMarkIcon>
        </div>
    </ClientOnly>
</template>
