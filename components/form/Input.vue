<script setup lang="ts">
import { useField } from 'vee-validate';

export interface Props {
    class: string;
    type?: string;
    isRequired?: boolean;
    isShowErrorMessage?: boolean;
    value?: string;
    name: string;
    label: string;
    refName?: string;
    successMessage?: string;
    placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    class: undefined,
    type: 'text',
    refName: 'input',
    value: undefined,
    isRequired: false,
    isShowErrorMessage: true,
    name: undefined,
    label: 'label',
    successMessage: undefined,
    placeholder: ' ',
});

// const emit = defineEmits(['update:modelValue']);
const {
    value: inputValue,
    errorMessage,
    handleChange,
    meta,
} = useField(props.name, undefined, {
    validateOnValueUpdate: false,
});

const validationListeners = {
    //   blur: (evt: any) => handleBlur(evt, false),
    //   change: handleChange,
    input: (evt: any) => handleChange(evt, false),
};
const generatedID = useId();

const emit = defineEmits(['onBlurHandle']);
</script>

<template>
    <div class="relative w-full">
        <input
            :id="generatedID"
            :ref="props.refName"
            v-bind="$attrs"
            :class="[
                tailwindMerge(
                    `autofill:shadow-[inset_0_0_0px_1000px_rgba(34,197,94,0.1)]', 'autofill:transition-[background-color] font-poppins-regular peer block h-6 w-full appearance-none  rounded-md border px-3 pb-3 pt-3 text-sm text-gray-900 autofill:border-slate-200 autofill:delay-0 autofill:duration-500
  autofill:ease-in-out focus:outline-none focus:ring-0 2xl:text-base`,
                    props.class,
                ),
                [
                    errorMessage ? 'border-red-500 text-red-500 focus:border-red-500' : 'border-slate-200',
                    meta.valid ? 'border-slate-300 focus:border-blue-600' : '',
                ],
            ]"
            placeholder=" "
            :name="props.name"
            :type="props.type"
            :value="inputValue"
            v-on="validationListeners"
            @blur="emit('onBlurHandle', inputValue)"
        />

        <label
            v-if="props.label"
            :for="generatedID"
            :class="errorMessage ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-400 peer-focus:text-blue-600'"
            class="absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
        >
            {{ props.label }}
            <span
                v-if="props.isRequired"
                class="text-rose-500"
            >
                *
            </span>
        </label>
    </div>

    <div
        v-if="props.isShowErrorMessage"
        class="h-5"
    >
        <VErrorMessage
            :name="props.name"
            class="text-xs italic text-red-500"
        ></VErrorMessage>
    </div>
</template>
