<script setup>
import { computed } from 'vue';

const emit = defineEmits(['update:checked']);

const props = defineProps({
    id: {
        type: [String, Number, Boolean],
        default: '',
    },
    checked: {
        type: [Array, Boolean],
        default: false,
    },
    value: {
        type: [String, Number, Boolean],
        default: null,
    },
});

const proxyChecked = computed({
    get() {
        return props.checked;
    },

    set(val) {
        emit('update:checked', val);
    },
});
</script>

<template>
    <input
        :id="id"
        v-model="proxyChecked"
        type="checkbox"
        :value="value"
        :class="checked ? 'border-gray-400' : 'border-gray-300'"
        class="rounded text-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
    />
</template>
