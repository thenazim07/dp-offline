<script lang="ts" setup>
import { useConfigsStore } from '~/stores/useConfigsStore';
const { relations } = storeToRefs(useConfigsStore());
const props = defineProps<{
    name?: string | undefined;
}>();

const convertedRelation = computed(() => {
    if (!relations.value)
        return [
            {
                label: '',
                value: null,
            },
        ];
    return Object.entries(relations.value).map(([key, value]) => ({
        label: value,
        key,
    }));
});

const { value } = useField<string>(() => (props.name ? `${props.name}.relation` : 'relation'));

const configRelationMenu = {
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
            :ui="configRelationMenu"
            :options="convertedRelation"
            value-attribute="label"
            option-attribute="label"
            placeholder="Select"
            @change="emit('change-value')"
        />
    </div>
</template>
