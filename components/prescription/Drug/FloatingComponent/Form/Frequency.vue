<script lang="ts" setup>
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
import { usePrescriptionDrugFrequenciesStore } from '~/stores/prescription/useDrugStore/frequencies';

const prescriptionDrugFrequenciesStore = usePrescriptionDrugFrequenciesStore();
const { frequenciesList } = storeToRefs(prescriptionDrugFrequenciesStore);
const instructionsValueList = computed(() => frequenciesList.value ?? []);
const prescriptionDrugStore = usePrescriptionDrugStore();
const { drugs } = storeToRefs(prescriptionDrugStore);
// const { inputClassToFocus } = useFocusOnParentElementsLastInputElement();
const props = withDefaults(
    defineProps<{
        classToFocus?: string;
        drugIndex?: number;
    }>(),
    {
        classToFocus: '',
        drugIndex: -1,
    },
);

const configDurationMenu = {
    base: 'h-[48px] w-full font-normal border-none ' + props.classToFocus,
    rounded: 'rounded',
    ring: 'ring-0',
    file: {
        base: 'file:border-0',
    },
    color: {
        white: {
            outline: 'ring-0 focus:ring-0 shadow-none',
        },
    },
};

function onInputFocusHandlerDropDownShow(event: Event) {
    event?.target?.parentNode?.getElementsByTagName('button')[0].click();
    if (!event?.target.value && props.drugIndex > -1) {
        prescriptionDrugFrequenciesStore.getFrequenciesWithSearchKey(
            '',
            drugs.value[props.drugIndex].drug_ref || drugs.value[props.drugIndex].ref,
            drugs.value[props.drugIndex].dosage_form_ref || drugs.value[props.drugIndex].dosage_form?.ref,
        );
    }
}

const emit = defineEmits(['selectItem', 'customCreate', 'modelValue', 'onInputKeyUpEnterHandler', 'search']);
</script>

<template>
    <UInputMenu
        class="frequencyUnique font-light"
        :ui="configDurationMenu"
        :options="instructionsValueList"
        value-attribute="value"
        option-attribute="value"
        placeholder="Ex: 1+1+0"
        :popper="{ strategy: 'fixed' }"
        @keyup.enter="
            ($event: any) => {
                emit('customCreate', $event?.target?.value);
                emit('onInputKeyUpEnterHandler');
            }
        "
        @update:model-value="(value: string) => emit('selectItem', value)"
        @input="(e) => emit('search', e.target.value)"
        @focus="onInputFocusHandlerDropDownShow"
    />
</template>

<!-- <style>
.frequencyUnique ul {
    width: 250px;
    position: absolute;
    left: 0px;
}
</style> -->
