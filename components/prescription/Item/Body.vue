<script setup lang="ts">
const props = defineProps({
    className: {
        type: String,
        default: 'grid grid-cols-12 gap-4',
    },
    lastSectionStyle: {
        type: String,
        default: 'col-span-4',
    },
});
</script>

<template>
    <div :class="props.className">
        <slot name="body"></slot>
        <div :class="lastSectionStyle">
            <slot name="lastOne"></slot>
            <div>x</div>
        </div>
    </div>
</template>
