<script lang="ts" setup>
import type { duration_locale_persist_store_types } from '~/repository/modules/ConfigModule/types';
import { useConfigsStore } from '~/stores/useConfigsStore';
const { durationTypes, drugDurationTypes } = storeToRefs(useConfigsStore());

const props = defineProps<{
    class?: string | undefined;
    duration: any;
    durationType: any;
    durationLocale: any;
    useDrugDurationType: boolean;
    shownDurationTypes: string[];
    durationLocalePersistStoreType: keyof duration_locale_persist_store_types;
}>();

const convertedDuration = computed(() => {
    if (props.useDrugDurationType) {
        if (!drugDurationTypes.value) return [];
        return Object.entries(drugDurationTypes.value).map(([key, value]) => ({
            label: value,
            value: key,
        }));
    }

    if (!durationTypes.value) return [];
    return Object.entries(durationTypes.value).map(([key, value]) => ({
        label: value,
        value: key,
    }));
});

const configDurationMenu = {
    base: 'h-[48px] max-1599:w-[100px] w-36 border-none  font-normal',
    rounded: 'rounded-none rounded-r',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 focus:ring-1 focus:ring-blue-500 shadow-none',
        },
    },
    option: {
        size: 'text-xs',
        selected: 'text-xs',
        create: 'text-xs',
    },
    select: 'text-xs text-right',
};

const emit = defineEmits([
    'update:duration',
    'update:duration-type',
    'update:duration-locale',
    'onInputKeyUpEnterHandler',
]);

const durationType = computed({
    // getter
    get() {
        return props.durationType;
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        // [firstName.value, lastName.value] = newValue.split(' ');
        emit('update:duration-type', newValue);
    },
});

const duration = computed({
    // getter
    get() {
        return props.duration;
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        // [firstName.value, lastName.value] = newValue.split(' ');
        emit('update:duration', newValue);
    },
});

const durationLocale = computed({
    // getter
    get() {
        return props.durationLocale;
    },
    // setter
    set(newValue) {
        emit('update:duration-locale', newValue);
    },
});
</script>

<template>
    <div :class="tailwindMerge(`flex items-center divide-x divide-gray-200 text-xs`, props.class)">
        <!-- <input
            class="placeholder-font-normal h-[48px] w-full rounded-l border-none text-sm font-normal text-gray-900 placeholder-gray-400 [appearance:textfield] focus:outline-none disabled:bg-gray-100"
            :value="props.duration"
            placeholder="0"
            @input="emit('update:duration', ($event.target as HTMLInputElement).value)"
            @keydown.enter="() => emit('onInputKeyUpEnterHandler')"
        /> -->

        <!-- <select
            v-model="durationType"
            class="flex-grow rounded-r border-y-0 border-l border-r-0 p-3"
        >
            <option
                v-for="option in convertedDuration"
                :key="option.value"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </select> -->
        <!-- {{ durationLocale }} -->
        <DurationCalculator
            v-model:model-value-duration-number="duration"
            v-model:model-value-duration-type="durationType"
            v-model:model-value-duration-lang="durationLocale"
            :shown-duration-types="shownDurationTypes || []"
            :duration-locale-persist-store-type="durationLocalePersistStoreType"
            @keyDownEnter="() => emit('onInputKeyUpEnterHandler')"
        />

        <!--  <USelectMenu
            :ui="configDurationMenu"
            :options="convertedDuration"
            :model-value="props.durationType"
            value-attribute="value"
            option-attribute="label"
            :popper="{ strategy: 'fixed' }"
            :resize="true"
            class="durationWithType"
            @change="emit('update:duration-type', $event)"
        /> -->
    </div>
</template>

<!-- <style>
.durationWithType ul {
    /* width: 146px; */
    position: absolute;
    right: 84px;
}
</style> -->
