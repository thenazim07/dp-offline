<script lang="ts" setup>
const props = defineProps({
    name: {
        type: String,
        default: 'border',
    },

    className: {
        type: String,
        default: 'border h-12 2xl:py-3 px-4 text-sm 2xl:text-base',
    },

    isActive: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <button
        type="button"
        :class="[isActive ? 'text-skin-base' : 'text-slate-500', className]"
        class="font-poppins-regular relative inline-flex w-full items-center justify-center border-slate-200 bg-white text-center font-medium hover:bg-gray-50 focus:z-10 focus:outline-none"
    >
        {{ props.name }}
        <span
            v-if="isActive"
            class="absolute inset-x-0 bottom-0 h-[2px] bg-blue-500"
        ></span>
    </button>
</template>
