<script setup>
defineProps({
    type: {
        type: String,
        default: 'submit',
    },
    className: {
        type: [String, Object],
        default: 'px-4 py-2.5',
    },
});
</script>

<template>
    <button
        :type="type"
        :class="className"
        class="tracking-wides inline-flex w-full items-center justify-center rounded-md border border-transparent bg-skin-button-accent text-center text-xs font-semibold text-white transition hover:bg-skin-button-accent-hover focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25"
    >
        <slot />
    </button>
</template>
