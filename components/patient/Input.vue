<script setup lang="ts">
import { useField } from 'vee-validate';
import { toRef } from 'vue';

const props = defineProps({
    className: {
        type: String,
        default: 'text',
    },

    label: {
        type: String,
        default: 'text',
    },

    isRequired: {
        type: Boolean,
        default: false,
    },

    type: {
        type: String,
        default: 'text',
    },
    value: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        required: true,
    },

    successMessage: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
});

defineEmits(['update:modelValue']);

const name = toRef(props, 'name');

const { errorMessage, handleBlur, handleChange } = useField(name, undefined, {
    initialValue: props.value,
});

const generatedID = (name: string) => name.replace(/ /g, '_').toLowerCase();
</script>

<template>
    <div class="relative">
        <input
            :id="generatedID(label)"
            ref="input"
            :class="[
                errorMessage ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-600',
                className,
            ]"
            class="font-poppins-regular peer block w-full appearance-none rounded-md border bg-transparent px-3 pb-3 pt-3 text-sm text-gray-900 focus:outline-none focus:ring-0 2xl:text-base"
            placeholder=" "
            :name="name"
            :type="type"
            @input="handleChange"
            @blur="handleBlur"
        />

        <label
            :for="generatedID(label)"
            :class="errorMessage ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-500 peer-focus:text-blue-600'"
            class="font-poppins-regular absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
        >
            {{ label }}
            <span
                v-if="isRequired"
                class="text-rose-500"
            >
                *
            </span></label
        >
    </div>

    <VErrorMessage
        :name="name"
        class="font-poppins-regular text-xs italic text-red-500"
    ></VErrorMessage>
</template>
