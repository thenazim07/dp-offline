<script lang="ts" setup>
export interface PresetObject {
    name: string;
    uuid: number;
    description: [];
}

const props = defineProps({
    isDisable: {
        type: Boolean,
        default: false,
        required: false,
    },

    isDropdownShow: {
        type: Boolean,
        default: false,
        required: false,
    },

    presetList: {
        type: Array as PropType<Array<PresetObject>>,
        default: undefined,
        required: true,
    },

    selectedList: {
        type: Array,
        default: null,
        required: true,
    },
});

const emit = defineEmits(['selectedItem']);
</script>

<template>
    <div :class="{ 'relative opacity-5': isDisable }">
        <span
            v-if="isDisable"
            class="absolute inset-0 z-10 block cursor-not-allowed"
        ></span>
        <slot></slot>

        <div class="h-screen max-h-[30rem] overflow-x-hidden overflow-y-scroll scrollbar-none">
            <div
                v-if="presetList"
                class="flex flex-wrap"
            >
                <PrescriptionPopperView
                    v-for="item in presetList"
                    :key="item.uuid"
                    :item="item"
                    :is-active-item="props.selectedList.includes(item?.uuid)"
                    @select:item="(value: object) => emit('selectedItem', { ...value, value: value.des ?? '' })"
                />
            </div>
        </div>
    </div>
</template>
