<script lang="ts" setup>
const props = defineProps({
    for: {
        type: String,
        required: true,
        default: '',
    },

    label: {
        type: String,
        required: false,
        default: '',
    },

    required: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>

<template>
    <div class="relative">
        <slot></slot>

        <label
            :for="props.for"
            class="font-poppins-regular absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-slate-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
        >
            {{ props.label }}
            <span
                v-if="props.required"
                class="text-rose-500"
            >
                *
            </span>
        </label>
    </div>
</template>
