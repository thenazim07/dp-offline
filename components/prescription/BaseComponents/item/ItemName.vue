<script lang="ts" setup>
import { Bars3Icon } from '@heroicons/vue/24/outline';
const props = defineProps<{
    name?: string;
}>();
</script>

<template>
    <div class="flex items-start">
        <div class="w-8 pr-2">
            <Bars3Icon class="h-5 w-5 text-slate-300" />
        </div>
        <div>
            <p class="font-poppins-regular -mt-0.5 text-sm font-normal text-slate-800 2xl:text-base">
                {{ props.name }}
            </p>
        </div>
    </div>
</template>
