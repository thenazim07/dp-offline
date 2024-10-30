<script lang="ts" setup>
import { useConfigsStore } from '~/stores/useConfigsStore';
const { positions } = storeToRefs(useConfigsStore());
const props = defineProps<{
    name?: string | undefined;
}>();

const convertedDuration = computed(() => {
    if (!positions.value)
        return [
            {
                label: '',
                value: null,
            },
        ];
    return Object.entries(positions.value).map(([key, value]) => ({
        label: value,
        key,
    }));
});

const { value } = useField<string>(() => (props.name ? `${props.name}.body_position` : 'body_position'));

const configDurationMenu = {
    base: 'h-10 w-36 font-medium border',
    rounded: 'rounded-md',
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
    <div class="flex w-32 items-center">
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
