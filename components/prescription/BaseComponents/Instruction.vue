<script lang="ts" setup>
import { usePrescriptionDrugInstructionsStore } from '~/stores/prescription/drug/instructions';

const props = defineProps<{
    name?: string | undefined;
}>();

const { instructionsList } = storeToRefs(usePrescriptionDrugInstructionsStore());
const instructionsValueList = computed(() => instructionsList.value ?? []);

const { value } = useField<string>(() => (props.name ? `${props.name}.instruction` : 'instruction'));

const configDurationMenu = {
    base: 'h-10 w-full font-light border',
    rounded: 'rounded-md',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 focus:ring-1 focus:ring-blue-500 shadow-none',
        },
    },
};

const instructionsFieldItem: Ref<any> = ref(null);

const setFocus = () => {
    nextTick(() => {
        const inputElement = document.getElementById(instructionsFieldItem.value?.inputId);
        if (!inputElement) return;

        const inputAriaLabel = inputElement.getAttribute('aria-labelledby');
        const buttonID = inputAriaLabel ? document.getElementById(inputAriaLabel) : null;

        if (buttonID) {
            inputElement.addEventListener('focus', () => {
                buttonID.click();
            });

            buttonID.addEventListener('click', () => {
                buttonID.click();
            });
        }
    });
};

onMounted(setFocus);

onUnmounted(() => {
    instructionsFieldItem.value = null;
});

const emit = defineEmits(['change-value']);
</script>

<template>
    <UInputMenu
        ref="instructionsFieldItem"
        v-model="value"
        v-model:query="value"
        class="font-light"
        :ui="configDurationMenu"
        :options="instructionsValueList"
        value-attribute="value"
        option-attribute="value"
        placeholder="instruction"
        @change="emit('change-value')"
        @update:query="emit('change-value')"
    />
</template>
