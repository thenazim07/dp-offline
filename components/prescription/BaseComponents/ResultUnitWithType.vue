<script lang="ts" setup>
import { useConfigsStore } from '~/stores/useConfigsStore';
const { resultUnit } = storeToRefs(useConfigsStore());

const props = defineProps<{
    name?: string | undefined;
}>();

const convertedDuration = computed(() => {
    if (!resultUnit.value) return [];
    return Object.entries(resultUnit.value).map(([key, value]) => ({
        label: value,
        value: key.toLowerCase(),
    }));
});

const { value } = useField<string>(() => (props.name ? `${props.name}.result_unit` : 'result_unit'));

value.value = value.value ?? undefined;

const configDurationMenu = {
    base: 'h-10 w-36 border-r border-t font-medium border-b',
    rounded: 'rounded-none rounded-r-md',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 focus:ring-1 focus:ring-blue-500 shadow-none',
        },
    },
};

const emit = defineEmits(['change-value']);
</script>

<template>
    <div class="flex w-56 items-center">
        <VField
            :id="`${props.name}.result`"
            class="placeholder-font-normal h-10 w-full rounded-l-md border-b border-l border-t font-normal text-gray-900 placeholder-gray-400 [appearance:textfield] focus:outline-none disabled:bg-gray-100"
            type="number"
            placeholder="Ex: 123"
            :name="props.name ? `${props.name}.result` : 'result'"
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            :maxlength="3"
            @change="emit('change-value')"
        />

        <USelectMenu
            v-model="value"
            :ui="configDurationMenu"
            :options="convertedDuration"
            value-attribute="label"
            option-attribute="label"
            placeholder="Select"
            @change="emit('change-value')"
        />
    </div>
</template>
