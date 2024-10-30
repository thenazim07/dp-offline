<script lang="ts" setup>
const props = defineProps<{
    name: string;
    title: string;
    value: string | number | object;
}>();

const ageUnit = computed(() => props.title === 'Age');
const weight = computed(() => (props.title === 'Weight' ? 'Kg' : undefined));
</script>

<template>
    <p class="font-medium">
        <strong class="text-sm font-semibold text-slate-900 2xl:text-base"> {{ props.title }} </strong>:
        <span class="text-sm text-slate-600 2xl:text-base">
            <template v-if="!ageUnit && !(props.name === 'height')">
                {{ props.value }} {{ props.value ? weight : '' }}
            </template>
            <template v-else-if="props.name === 'height'">
                <template v-if="props?.value?.height_in_feet != null && props?.value?.height_in_inch != null">{{
                    props?.value?.height_in_feet + '′' + props?.value?.height_in_inch + '″'
                }}</template>
            </template>
            <template v-else>
                <template v-if="props.value.age">{{ props.value.age + 'y ' }}</template>
                <template v-if="props.value.age_month">{{ props.value.age_month + 'm ' }}</template>
                <template v-if="props.value.age < 1 && props.value.age_day">{{ props.value.age_day + 'd' }}</template>
            </template>
        </span>
    </p>
</template>
