<script lang="ts" setup>
const props = defineProps({
    isActive: {
        type: Boolean,
        required: true,
    },

    isError: {
        type: Boolean,
        required: false,
    },

    className: {
        type: String,
        required: false,
        default: 'border',
    },
});

const style = computed(() => {
    if ((props.isActive && props.isError) || (!props.isActive && props.isError)) {
        return 'border-red-500 text-red-500 bg-red-500';
    }

    if (props.isActive) {
        return 'border-blue-500 text-blue-500 bg-blue-500';
    }
    return 'text-slate-500 border-slate-200 bg-transparent';
});
</script>

<template>
    <button
        :class="[style, className]"
        class="font-poppins-regular relative inline-flex h-11 w-full items-center justify-center bg-white px-4 text-center text-xs font-medium hover:bg-gray-50 focus:z-10 focus:border-blue-200 focus:outline-none 2xl:h-12 2xl:py-3 2xl:text-sm"
        :aria-current="isActive ? 'page' : undefined"
    >
        <span>
            <slot></slot>
        </span>
        <span
            aria-hidden="true"
            :class="[style, 'absolute bottom-0 left-0 block h-0.5 w-full']"
        ></span>
    </button>
</template>
