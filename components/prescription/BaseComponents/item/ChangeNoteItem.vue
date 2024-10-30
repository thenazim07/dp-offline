<script lang="ts" setup>
const props = defineProps<{
    list: [] | any;
}>();
</script>

<template>
    <UDropdown
        :ui="{ width: 'w-64', height: 'max-h-72' }"
        :items="props.list"
        :popper="{ arrow: true }"
    >
        <UButton
            :ui="{
                icon: {
                    size: {
                        sm: 'h-6 w-6',
                    },
                },
            }"
            class="flex h-10 items-center"
            :padded="false"
            color="gray"
            variant="link"
            icon="i-heroicons-chevron-down-20-solid"
        />
        <template #item="{ item }">
            <span class="text-left">{{ item.label }}</span>
        </template>
    </UDropdown>
</template>
