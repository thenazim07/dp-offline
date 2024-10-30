<script lang="ts" setup>
interface SearchProps {
    search: any;
    loading: boolean;
    placeholder?: string;
    optionAttribute: string;
    autofocus?: boolean;
    valueAttribute?: null | string;
}

const props = withDefaults(defineProps<SearchProps>(), {
    autofocus: true,
    valueAttribute: null,
});
const uniqueId = generateUniqueText();

const emit = defineEmits(['selectItem', 'customCreate', 'modelValue']);

const config = {
    wrapper: '',
    base: 'w-full ring-0 shadow-none rounded-lg p-3.5 border focus:border-blue-500 border-slate-300 bg-white leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm',
    padding: 'py-3 pl-10 pr-3',
    color: {
        white: {
            outline: 'shadow-none ring-0 focus:ring-0 focus:outline-border-blue-600 focus:ring-blue-600',
        },
    },
};

function setFocus() {
    nextTick(() => {
        // const inputElement = document.getElementById(uniqueId);
        // if (inputElement && props.autofocus) inputElement.focus();
    });
}

onMounted(setFocus);
</script>

<template>
    <!-- leading-icon="i-heroicons-magnifying-glass-20-solid" -->
    <UInputMenu
        :id="uniqueId"
        :ui="config"
        :search="props.search"
        :loading="props.loading"
        :placeholder="props.placeholder"
        :option-attribute="props.optionAttribute"
        :value-attribute="props.valueAttribute"
        :search-lazy="true"
        leading
        trailing-icon="''"
        @keyup.enter="($event: any) => emit('customCreate', $event?.target?.value)"
        @update:model-value="(value) => emit('selectItem', value)"
    />
    <!-- 

        

     -->
</template>

<style>
.z-20.group.w-full {
    transform: translate(0px, 43px) !important;
}
</style>
