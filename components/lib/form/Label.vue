<script lang="ts" setup>
const props = defineProps<{
    name: string | number;
    required: boolean;
}>();
</script>

<template>
    <label
        class="absolute left-2 top-2 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-[14px] text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
    >
        {{ props.name }}
        <span
            v-if="props.required"
            class="text-red-500"
        >
            *
        </span>
    </label>
</template>
