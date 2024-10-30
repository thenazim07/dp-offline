<script lang="ts" setup>
export interface Props {
    isError?: boolean;
    isSelected?: boolean;
    isShowTitle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isError: false,
    isSelected: false,
    isShowTitle: true,
});

const isSelectedStyle = computed(() => {
    return props.isError
        ? props.isSelected
            ? 'ring-red-500'
            : 'ring-transparent'
        : props.isSelected
          ? 'ring-blue-500'
          : 'text-slate-500 ring-transparent border-slate-200 ';
});
</script>

<template>
    <div
        class="w-full cursor-pointer rounded-lg bg-slate-100 px-3 py-3 ring-1 transition duration-500"
        :class="isSelectedStyle"
    >
        <div
            v-if="props.isShowTitle"
            class="mb-1.5 flex items-start justify-between"
        >
            <slot name="title" />
        </div>
        <slot name="content" />
    </div>
</template>
