<script setup>
defineProps({
    type: {
        type: String,
        default: 'submit',
    },
    className: {
        type: String,
        default: 'text-xs',
    },
});
</script>

<template>
    <button
        :type="type"
        :class="className"
        class="font-poppins-regular inline-flex items-center justify-center rounded-md border border-transparent bg-skin-button-accent px-4 py-3 text-center font-medium text-white shadow-sm transition hover:bg-skin-button-accent-hover focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25"
    >
        <slot />
    </button>
</template>
