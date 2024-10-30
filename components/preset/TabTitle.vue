<script lang="ts" setup>
const props = defineProps<{
    title?: string;
}>();
</script>

<template>
    <div class="mb-4 flex items-center 2xl:mb-6">
        <h6 class="font-poppins-regular mr-2 text-base font-semibold text-black">
            {{ props.title === 'Observations' ? 'On Examinations' : props.title }}
        </h6>
        <p class="font-poppins-regular text-xs font-normal text-slate-500">
            <slot></slot>
        </p>
    </div>
</template>
