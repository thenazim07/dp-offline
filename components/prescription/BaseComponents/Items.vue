<script lang="ts" setup>
const props = defineProps<{
    class?: string;
    maxHeight?: number;
}>();
</script>

<template>
    <div
        :class="tailwindMerge(`space-y-3 overflow-auto px-1 pb-20 pt-2  scrollbar-none `, props.class)"
        :style="`height: ${props.maxHeight}px;`"
    >
        <slot />
    </div>
</template>
