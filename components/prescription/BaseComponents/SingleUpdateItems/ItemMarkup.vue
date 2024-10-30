<script lang="ts" setup>
import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '@headlessui/vue';

export interface Props {
    list: [] | any;
    name?: string;
    position?: string;
}

const props = withDefaults(defineProps<Props>(), {
    // eslint-disable-next-line vue/require-valid-default-prop
    list: [],
    name: '',
    position: 'left',
});
const emit = defineEmits(['update:singleItem']);
</script>

<template>
    <ul
        v-if="props.list.length > 0"
        class="ml-2.5 pr-2"
    >
        <li
            v-for="(item, index) in props.list"
            :key="item.prescription_ref + index + item.ref + item.name + item.title + item.value"
        >
            <Popover>
                <div
                    :class="{ relative: props.position === 'right' }"
                    class="flex w-full justify-between space-x-2 py-0.5 pr-2 2xl:py-1"
                >
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
                            :class="props.position === 'left' ? '2xl:left-56' : '2xl:-left-4'"
                            class="absolute z-30 block w-full max-w-3xl rounded-lg bg-white p-4 shadow-follow-up lg:left-12 xl:left-32 xl:mt-6 2xl:mt-8 2xl:max-w-4xl"
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
</template>
