<script lang="ts" setup>
export interface PresetObject {
    name: string;
    uuid: number;
    description: [];
}

const props = defineProps({
    name: {
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
    <div class="flex h-full flex-col gap-5">
        <div
            v-if="presetList"
            class="flex flex-grow items-start overflow-auto rounded-md bg-slate-50 p-5 scrollbar"
        >
            <div class="flex flex-wrap">
                <PrescriptionBaseComponentsPopperView
                    v-for="item in presetList"
                    :key="item.uuid"
                    :item="item"
                    :is-active-item="props?.selectedList?.includes(item?.uuid)"
                    @select:item="
                        (value: object) =>
                            emit('selectedItem', { ...value, value: value.des ?? '', instruction: value.des ?? '' })
                    "
                />
            </div>
        </div>
        <slot></slot>
    </div>
</template>
