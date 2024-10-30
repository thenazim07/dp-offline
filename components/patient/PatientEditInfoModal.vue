<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <TransitionRoot
        appear
        :show="show"
        as="template"
    >
        <Dialog
            :open="show"
            class="relative z-50"
            static
        >
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div
                    class="fixed inset-0 bg-black/30"
                    aria-hidden="true"
                />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
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
                            as="div"
                            class="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl 2xl:max-w-[51rem]"
                        >
                            <DialogTitle>
                                <p class="font-poppins-regular mb-6 text-xl font-normal text-slate-800 2xl:text-2xl">
                                    Edit Patient
                                </p>
                            </DialogTitle>

                            <div class="absolute right-4 top-4 cursor-pointer">
                                <slot name="close"></slot>
                            </div>

                            <slot name="form"></slot>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
