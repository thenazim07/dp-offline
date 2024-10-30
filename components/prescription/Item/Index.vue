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
    if ((props.isSelected && props.isError) || (!props.isSelected && props.isError)) {
        return 'ring-red-500';
    }
    if (props.isSelected) {
        return 'ring-blue-500';
    }
    return 'text-slate-500 border-slate-200 ring-transparent';
});
</script>

<template>
    <div
        class="w-full cursor-pointer rounded-lg bg-slate-100 px-3 py-3 ring-1"
        :class="isSelectedStyle"
    >
        <slot></slot>
    </div>
</template>
