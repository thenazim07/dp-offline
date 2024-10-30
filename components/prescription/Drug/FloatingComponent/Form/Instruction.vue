<script lang="ts" setup>
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
import { usePrescriptionDrugInstructionsStore } from '~/stores/prescription/useDrugStore/instructions';

const props = withDefaults(
    defineProps<{
        drugIndex?: number;
    }>(),
    {
        drugIndex: -1,
    },
);

const prescriptionDrugInstructionsStore = usePrescriptionDrugInstructionsStore();
const { instructionsList } = storeToRefs(prescriptionDrugInstructionsStore);
const instructionsValueList = computed(() => instructionsList.value ?? []);
const prescriptionDrugStore = usePrescriptionDrugStore();
const { drugs } = storeToRefs(prescriptionDrugStore);

const configDurationMenu = {
    base: 'h-[48px] w-full font-normal border-none',
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

function onInputFocusHandlerDropDownShow(event: Event) {
    event?.target?.parentNode?.getElementsByTagName('button')[0].click();

    if (!event?.target.value && props.drugIndex > -1) {
        prescriptionDrugInstructionsStore.getInstructionsBySearchKey(
            '',
            drugs.value[props.drugIndex].drug_ref || drugs.value[props.drugIndex].ref,
        );
    }
}

const emit = defineEmits(['change-value', 'search']);
</script>

<template>
    <UInputMenu
        ref="instructionsFieldItem"
        class="font-light"
        :ui="configDurationMenu"
        :options="instructionsValueList"
        value-attribute="value"
        option-attribute="value"
        placeholder="instruction"
        :popper="{ strategy: 'fixed' }"
        @keyup.enter="($event: any) => emit('change-value', $event?.target?.value)"
        @update:model-value="(value: string) => emit('change-value', value)"
        @input="(e) => emit('search', e.target.value)"
        @focus="onInputFocusHandlerDropDownShow"
    />
</template>
