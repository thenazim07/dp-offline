<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { usePrescriptionDrugInstructionsStore } from '~/stores/prescription/drug/instructions';
const props = defineProps<{
    name?: string | undefined;
}>();
const emit = defineEmits(['change-value']);
const { instructionsList } = storeToRefs(usePrescriptionDrugInstructionsStore());
const instructionsValueList = computed(() => instructionsList.value ?? []);
const toast = useToast();

function validateSpecialInstruction(instruction: string) {
    const maxLength = 200;
    let errorMessage = null;

    if (!instruction.trim()) {
        errorMessage = 'Special instruction cannot be empty or contain only spaces.';
    } else if (instruction.length > maxLength) {
        errorMessage = `Special instruction must be less than ${maxLength} characters.`;
    }

    if (errorMessage) {
        toast.add({ title: errorMessage, color: 'red' });
    }

    return errorMessage;
}

const addNewItem = (item: any, setItem: any, removeItem: any = null, previousItems: []) => {
    const isValid = validateSpecialInstruction(item);

    if (isValid) return false;

    const isItem = previousItems.some((itemObj) => itemObj.value.uuid === getUuid(item));

    if (isItem) {
        if (!removeItem) return false;
        const hasKey = previousItems.find((itemObj) => (itemObj.value.uuid === getUuid(item) ? itemObj.value : null));
        removeItem(hasKey.key);
        emit('change-value');
        return false;
    }

    setItem({
        value: item,
        uuid: getUuid(item),
    });

    emit('change-value');
};

const removeItem = (key: any, removeItem: any) => {
    removeItem(key);
    emit('change-value');
};

const checkRefMatch = (array: [], refToMatch: string) => {
    if (!array) return false;
    return array.some((item) => item.value.uuid === getUuid(refToMatch));
};
</script>

<template>
    <FieldArray
        v-slot="{ fields: instructions, push, remove }"
        :name="props.name ? `${props.name}.instructions` : 'instructions'"
    >
        <div class="flex w-full pr-[15px]">
            <LibFormSearchWithDropdwon
                v-slot="{ show, active }"
                class-name="bg-white"
                :is-multiple="true"
                :options="instructionsValueList"
                placeholder="Special Instruction"
                @update:model-value="(value: any) => addNewItem(value, push, null, instructions)"
            >
                <div
                    :class="active ? 'bg-blue-500 text-white' : ''"
                    class="font-poppins-regular flex w-full cursor-pointer items-center space-x-2 px-3 hover:bg-blue-500 hover:text-white"
                >
                    <LibFormCheckbox
                        :id="show.ref"
                        :value="show.ref"
                        :checked="checkRefMatch(instructions, show.value)"
                        class="h-5 w-5 cursor-pointer"
                        @update:checked="() => addNewItem(show.value, push, remove, instructions)"
                    ></LibFormCheckbox>

                    <label
                        :for="show.ref"
                        class="ml-2 block w-full cursor-pointer py-2"
                    >
                        {{ show.value }}
                    </label>
                </div>
            </LibFormSearchWithDropdwon>
        </div>

        <div :class="instructions.length > 0 ? 'pt-3' : 'py-0'">
            <button
                v-for="(inst, key) in instructions"
                :key="inst.key"
                type="button"
                class="mb-3 mr-3 inline-flex items-center rounded-full bg-slate-200 px-3 py-1.5 text-slate-800 hover:bg-slate-300"
            >
                {{ inst?.value?.value ?? inst.value }}

                <XCircleIcon
                    class="ml-3 h-5 w-5 rounded-full text-slate-500 hover:text-red-500"
                    @click="removeItem(key, remove)"
                />
            </button>
        </div>
    </FieldArray>
</template>
