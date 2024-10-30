<script lang="ts" setup>
const props = defineProps<{
    name?: string | undefined;
    textareaName: string;
}>();
const emit = defineEmits(['change-value']);

const name = computed(() => (props.name ? `${props.name}${props.textareaName}` : props.textareaName));
</script>

<template>
    <VField
        v-slot="{ field }"
        :name="name"
    >
        <UTextarea
            :ui="{
                base: 'h-10 text-lg w-full block min-h-[2rem] font-meduim',
                color: {
                    white: {
                        outline: 'ring-slate-200 focus:ring-1 focus:ring-blue-600',
                    },
                },
            }"
            size="lg"
            resize
            v-bind="field"
            :maxlength="255"
            placeholder="Note"
            @change="emit('change-value')"
        />
    </VField>
</template>
