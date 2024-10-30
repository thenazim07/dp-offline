<script lang="ts" setup>
defineProps({
    items: {
        type: [Object, Array],
        default: null,
    },
});
</script>

<template>
    <tbody class="divide-y-4 divide-slate-50 bg-white">
        <tr
            v-for="(item, index) in items"
            :key="index"
            class=""
        >
            <slot :item="item" />
        </tr>
    </tbody>
</template>
