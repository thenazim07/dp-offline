<script lang="ts" setup>
import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '@headlessui/vue';

export interface Props {
    list: [];
    name?: string;
}

const props = withDefaults(defineProps<Props>(), {
    list: undefined,
    name: '',
});

const emit = defineEmits(['update:singleItem']);
</script>

<template>
    <div
        v-if="props.list.length > 0"
        :name="props.name"
    >
        <p class="font-poppins-regular py-1.5 text-base font-semibold">{{ props.name }}:</p>

        <ul
            role="list"
            class="ml-2.5 pr-2"
        >
            <li
                v-for="item in props.list"
                :key="`${item.unique_keys}-${item.name}`"
            >
                <Popover class="max-w-4xl">
                    <div class="flex w-full justify-between space-x-2 py-0.5 pr-2 2xl:py-1">
                        <PopoverButton
                            class="before:mr- font-poppins-regular relative text-left text-sm font-normal leading-5 text-slate-600 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod hover:bg-slate-200"
                        >
                            <slot
                                :item="item"
                                name="title"
                            ></slot>
                        </PopoverButton>

                        <PopoverOverlay
                            class="fixed inset-0"
                            @click="emit('update:singleItem')"
                        />

                        <transition
                            enter-active-class="transition duration-200 ease-out"
                            enter-from-class="translate-y-1 opacity-0"
                            enter-to-class="translate-y-0 opacity-100"
                            leave-active-class="transition duration-150 ease-in"
                            leave-from-class="translate-y-0 opacity-100"
                            leave-to-class="translate-y-1 opacity-0"
                        >
                            <PopoverPanel
                                class="absolute z-30 w-full max-w-3xl rounded-lg bg-white p-4 shadow-follow-up lg:left-12 xl:left-32 xl:mt-6 2xl:left-56 2xl:mt-8 2xl:max-w-4xl"
                            >
                                <slot
                                    name="content"
                                    :item="item"
                                ></slot>
                            </PopoverPanel>
                        </transition>

                        <div>
                            <slot
                                name="delete"
                                :item="item"
                            ></slot>
                        </div>
                    </div>
                </Popover>
            </li>
        </ul>
    </div>
</template>
