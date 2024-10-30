<script lang="ts" setup>
const props = defineProps({
    name: {
        type: String,
        required: false,
        default: '',
    },

    isSelected: {
        type: Boolean,
        required: true,
        default: false,
    },
});
</script>

<template>
    <div
        class="font-poppins-regular inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-500 hover:border-blue-500 hover:text-blue-500"
        :class="props?.isSelected ? 'border-blue-500 text-blue-500' : ''"
    >
        <p v-if="props.name">{{ props?.name }}</p>
        <div v-else>
            <slot></slot>
        </div>
    </div>
</template>
