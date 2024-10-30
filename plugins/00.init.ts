import { configure } from 'vee-validate';

export default defineNuxtPlugin(async (nuxtApp) => {
    // Default values
    configure({
        validateOnBlur: false, // controls if `blur` events should trigger validation with `handleChange` handler
        validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
        validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
        validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
    });
});
