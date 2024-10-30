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
            class="relative"
        >
            <slot :item="item" />
            <NuxtLink
                :to="`/patients/details/${item.id}`"
                class="absolute inset-0 -top-1 bg-transparent opacity-10 hover:bg-slate-200"
            ></NuxtLink>
        </tr>
    </tbody>
</template>
