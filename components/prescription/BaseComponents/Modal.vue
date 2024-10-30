<script lang="ts" setup>
import { useConfigsStore } from '~/stores/useConfigsStore';
const { modalHeight } = storeToRefs(useConfigsStore());

export interface Props {
    show?: boolean;
    class?: string;
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    show: false,
    class: undefined,
    title: 'Modal',
});

// const emit = defineEmits<{
//     (e: 'modal:close', value: boolean): boolean;
// }>();

const config = {
    strategy: 'override',
    width: 'w-full max-w-6xl 2xl:max-w-7xl',
    height: 'h-[90vh] 2xl:h-[80vh]',
    // base: 'overflow-visable',
    // height: 'h-[40rem] 2xl:h-[54rem]',
    // base: 'overflow-visable', past drug history date picker problem overflow-hidden
    overlay: {
        base: 'fixed inset-0 ',
        background: 'bg-black/5',
    },
};

const modal = ref(null);

useResizeObserver(modal, (entries) => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    modalHeight.value = Number(height);
});
</script>

<template>
    <UModal
        :model-value="props.show"
        prevent-close
        :ui="config"
    >
        <div
            ref="modal"
            class="flex h-full flex-col px-8 pb-5"
        >
            <slot />
        </div>
    </UModal>
</template>
