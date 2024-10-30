<script setup lang="ts">
let dataFromPaste: string[] | undefined;
const keysAllowed: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const props = defineProps<{
    modelValue?: string | number;
}>();

let code: string[] = props.modelValue ? Array.from(String(props.modelValue), Number) : Array(6);

const emits = defineEmits(['update:modelValue']);

function isNumber(event: Event) {
    (event.currentTarget as HTMLInputElement).value = '';
    const keyPressed: string = (event as KeyboardEvent).key;
    if (!keysAllowed.includes(keyPressed)) {
        event.preventDefault();
    }
}

function handleInput(event: Event) {
    const inputType = (event as InputEvent).inputType;
    let currentActiveElement = event.target as HTMLInputElement;

    if (inputType === 'insertText') (currentActiveElement.nextElementSibling as HTMLElement)?.focus();

    if (inputType === 'insertFromPaste' && dataFromPaste) {
        for (const num of dataFromPaste) {
            const id: number = parseInt(currentActiveElement.id.split('_')[1]);
            currentActiveElement.value = num;
            code[id] = num;
            if (currentActiveElement.nextElementSibling) {
                currentActiveElement = currentActiveElement.nextElementSibling as HTMLInputElement;
                (currentActiveElement.nextElementSibling as HTMLElement)?.focus();
            }
        }
    }

    emits('update:modelValue', parseInt(code.join(''), 10));
}

function handleDelete(event: Event) {
    // keydown event = move to previous element then only delete number

    const value = (event.target as HTMLInputElement).value;
    const currentActiveElement = event.target as HTMLInputElement;
    if (!value) (currentActiveElement.previousElementSibling as HTMLElement)?.focus();
}

function onPaste(event: Event) {
    dataFromPaste = (event as ClipboardEvent).clipboardData?.getData('text').trim().split('');

    if (dataFromPaste) {
        for (const num of dataFromPaste) {
            if (!keysAllowed.includes(num)) event.preventDefault();
        }
    }
}

watchEffect(() => {
    if (!props.modelValue) {
        code = Array(6);
    }

    if (props.modelValue?.toString().length === 6) {
        code = Array.from(String(props.modelValue), Number);
    }
});
</script>

<template>
    <div class="flex gap-x-5">
        <input
            v-for="(n, index) in code"
            :id="'input_' + index"
            :key="index"
            v-model="code[index]"
            type="text"
            pattern="\d*"
            class="h-14 w-14 appearance-none rounded-lg border border-gray-200 text-center text-lg font-semibold"
            maxlength="1"
            @input="handleInput"
            @keypress="isNumber"
            @keydown.delete="handleDelete"
            @paste="onPaste"
        />
    </div>
</template>
