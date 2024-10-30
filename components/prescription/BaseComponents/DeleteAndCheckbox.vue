<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
    isSelectedMode: boolean;
    checked: boolean;
    disabled?: boolean;
}>();

const emit = defineEmits(['deleteItem', 'checkedOrUnchecked']);
</script>

<template>
    <div class="flex items-center">
        <button
            v-if="!props.isSelectedMode"
            @click="emit('deleteItem')"
        >
            <TrashIcon class="h-5 w-5 cursor-pointer text-red-500"> </TrashIcon>
        </button>

        <LibFormCheckbox
            v-else
            :title="props.disabled ? 'Custom item is not allowed' : ''"
            :checked="props.disabled ? false : props.checked"
            :disabled="props.disabled"
            @keydown.enter="emit('checkedOrUnchecked')"
            @click="emit('checkedOrUnchecked')"
        />
    </div>
</template>
