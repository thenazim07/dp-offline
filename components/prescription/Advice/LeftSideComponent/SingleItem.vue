<script lang="ts" setup>
import { Bars3Icon } from '@heroicons/vue/24/outline';
const props = defineProps<{
    name?: string;
    field: object | any;
    idx?: number | null;
}>();
const emit = defineEmits(['change-value']);
</script>

<template>
    <div class="flex items-center space-x-4">
        <div class="w-8">
            <div class="px-2">
                <Bars3Icon class="h-5 w-5 text-slate-300" />
            </div>
        </div>

        <div class="flex-1">
            <PrescriptionBaseComponentsTextarea
                :name="props.name ?? undefined"
                textarea-name="name"
                @change-value="emit('change-value')"
            />
        </div>

        <div>
            <slot />
        </div>
    </div>
</template>
