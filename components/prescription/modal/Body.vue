<script lang="ts" setup>
import { DialogPanel, TransitionChild } from '@headlessui/vue';

const props = defineProps({
    className: {
        type: String,
        default: 'overflow-hidden',
    },
});
</script>

<template>
    <ClientOnly>
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
                class="fixed inset-0 bg-black/5"
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
                        id="area"
                        as="div"
                        :class="props.className"
                        class="relative h-[40rem] w-full rounded-lg bg-white p-6 shadow-2xl xl:max-w-6xl 2xl:h-[45rem] 2xl:max-w-[88.5rem] 2xl:p-10"
                    >
                        <slot name="title"></slot>

                        <div class="flex h-full min-h-[25rem] pt-3 2xl:pt-8">
                            <div
                                class="left relative pr-6"
                                :style="`width: 65%`"
                            >
                                <slot name="left"></slot>
                            </div>

                            <div
                                class="right w-full rounded-lg bg-slate-50 p-5"
                                :style="`width: 35%`"
                            >
                                <slot name="right"></slot>
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </div>
    </ClientOnly>
</template>
