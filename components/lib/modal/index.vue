<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

export interface Props {
    open?: boolean;
    class?: string;
    isShowCloseIcon?: boolean;
    closeable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    open: true,
    class: undefined,
    closeable: false,
    isShowCloseIcon: true,
});

const emit = defineEmits<{
    (e: 'modal:close', value: boolean): boolean;
}>();

const closeModal = (whereClick: string): void => {
    if (whereClick === 'outside' && props.closeable === true) {
        emit('modal:close', true);
    }
    if (whereClick === 'inside') {
        emit('modal:close', true);
    }
};
</script>

<template>
    <TransitionRoot
        appear
        :show="props.open"
        as="template"
    >
        <Dialog
            as="div"
            class="relative z-50"
            @click="closeModal('outside')"
        >
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <TransitionChild
                        as="template"
                        enter="duration-150 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-150 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <div
                            class="fixed inset-0 bg-black/5"
                            aria-hidden="true"
                        />
                    </TransitionChild>

                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            id="area"
                            as="div"
                            :class="
                                tailwindMerge(
                                    `relative h-[40rem] w-full rounded-lg bg-white p-6 shadow-2xl xl:max-w-6xl 2xl:h-[50rem] 2xl:max-w-[88.5rem] 2xl:p-10`,
                                    props.class,
                                )
                            "
                        >
                            <button
                                v-if="isShowCloseIcon"
                                type="button"
                                class="absolute right-2 top-2"
                                @click="closeModal('inside')"
                            >
                                <XMarkIcon class="h-5 w-5 cursor-pointer text-slate-500"></XMarkIcon>
                            </button>

                            <DialogTitle
                                as="h3"
                                class="font-poppins-regular text-lg font-normal text-slate-800 2xl:text-2xl"
                            >
                                <slot name="title" />
                            </DialogTitle>

                            <div class="mt-2">
                                <slot name="content"></slot>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
