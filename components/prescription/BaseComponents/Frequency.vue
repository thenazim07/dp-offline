<script lang="ts" setup>
import { usePrescriptionDrugFrequenciesStore } from '~/stores/prescription/drug/frequencies';

const props = defineProps<{
    name?: string | undefined;
}>();

const { frequenciesList } = storeToRefs(usePrescriptionDrugFrequenciesStore());

const instructionsValueList = computed(() => frequenciesList.value ?? []);

const { value } = useField<string>(() => (props.name ? `${props.name}.frequency` : 'frequency'));

value.value = value.value ?? '';

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

const emit = defineEmits(['change-value']);

const instructionsField: Ref<any> = ref(null);

const setFocus = () => {
    nextTick(() => {
        const inputElement = document.getElementById(instructionsField.value?.inputId);
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
    instructionsField.value = null;
});
</script>

<template>
    <UInputMenu
        ref="instructionsField"
        v-model="value"
        v-model:query="value"
        class="font-light"
        :ui="configDurationMenu"
        :options="instructionsValueList"
        value-attribute="value"
        option-attribute="value"
        placeholder="Ex: 1+1+0"
        @change="emit('change-value')"
        @update:query="emit('change-value')"
    />
</template>
