<script lang="ts" setup>
const props = defineProps({
    active: {
        type: Boolean,
        required: false,
    },
});
</script>

<template>
    <button
        :class="props.active ? 'border-blue-500 text-blue-500' : ''"
        class="font-poppins-regular group mb-3 mr-3 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-500 focus:border-blue-500"
    >
        <slot></slot>
    </button>
</template>
