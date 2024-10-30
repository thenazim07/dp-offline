<script lang="ts" setup>
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div class="flex items-center justify-between">
        <div>
            <p class="font-poppins-regular text-sm font-normal 2xl:text-base">
                {{ props.name }}
            </p>
        </div>

        <div>
            <slot></slot>
        </div>
    </div>
</template>
