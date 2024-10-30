<script lang="ts" setup>
const props = defineProps({
    isError: {
        type: Boolean,
        default: false,
        required: false,
    },

    isSelected: {
        type: Boolean,
        default: false,
        required: false,
    },
});

const isSelectedStyle = computed(() => {
    return props.isError
        ? props.isSelected
            ? 'ring-red-500'
            : 'ring-transparent'
        : props.isSelected
          ? 'ring-blue-500'
          : 'text-slate-500 ring-transparent border-slate-200 ';
});
</script>

<template>
    <div
        class="w-full cursor-pointer rounded-lg bg-slate-100 px-3 py-3 ring-1 transition duration-500"
        :class="isSelectedStyle"
    >
        <slot></slot>
    </div>
</template>
