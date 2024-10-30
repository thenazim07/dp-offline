<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { object, string } from 'yup';

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
        required: true,
    },

    placeholder: {
        type: String,
        default: '',
        required: true,
    },
});

const initialValues: Object = {
    item_name: '',
    weight: '',
};

const schema = object({
    item_name: string().required().max(80).label('Name'),
    weight: string().required().max(4).label('Score'),
});

const $emit = defineEmits(['onSubmit']);
</script>

<template>
    <div class="mb-8 flex items-center">
        <slot></slot>
        <div class="ml-3 flex-shrink-0">
            <Popover class="relative">
                <PopoverButton
                    class="font-poppins-regular group flex h-10 w-full items-center justify-center rounded-full bg-[#DBEAFE] px-6 text-sm font-normal hover:bg-skin-fill hover:text-white focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] focus:ring-offset-2 focus:ring-offset-slate-50 sm:w-auto"
                >
                    <PlusIcon class="mr-1 h-4 w-4 text-slate-900 group-hover:text-white"></PlusIcon>
                    Create New
                </PopoverButton>

                <transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="translate-y-1 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="translate-y-1 opacity-0"
                >
                    <PopoverPanel
                        v-slot="{ close }"
                        class="absolute -top-1 right-[10rem] z-10"
                    >
                        <div class="min-h-[17rem] w-[19.75rem] rounded-lg bg-white p-6 shadow-follow-up">
                            <VForm
                                :validation-schema="schema"
                                :initial-values="initialValues"
                                @submit="$emit('onSubmit', { $event, close })"
                            >
                                <div class="mb-4">
                                    <label
                                        for="name"
                                        class="font-poppins-regular mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Name
                                    </label>
                                    <VField
                                        id="item_name"
                                        ref="item_name"
                                        name="item_name"
                                        type="text"
                                        class="font-poppins-regular block w-full rounded-sm border border-slate-300 bg-white py-2.5 pl-4 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                                        :placeholder="props.placeholder"
                                    />
                                    <VErrorMessage
                                        name="item_name"
                                        class="font-poppins-regular text-xs italic text-red-500"
                                    ></VErrorMessage>
                                </div>

                                <div class="mb-6">
                                    <label
                                        for="score"
                                        class="font-poppins-regular mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Score
                                    </label>

                                    <VField
                                        id="weight"
                                        ref="weight"
                                        name="weight"
                                        type="number"
                                        class="font-poppins-regular block w-full rounded-sm border border-slate-300 bg-white py-2.5 pl-4 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                                        placeholder="Enter Score"
                                    />
                                    <VErrorMessage
                                        name="weight"
                                        class="font-poppins-regular text-xs italic text-red-500"
                                    ></VErrorMessage>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        :disabled="isLoading"
                                        :class="
                                            isLoading
                                                ? 'bg-slate-400'
                                                : 'bg-skin-button-accent hover:bg-skin-button-accent-hover'
                                        "
                                        class="tracking-wides inline-flex w-full items-center justify-center rounded-md border border-transparent py-3 text-center text-xs font-semibold text-white transition focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25"
                                    >
                                        <LibIconLoadingCircle v-if="isLoading" />
                                        <span
                                            v-else
                                            class="mr-2 block h-5 w-5 cursor-pointer rounded-full bg-skin-fill p-px ring ring-transparent"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 18 18"
                                            >
                                                <g fill="#ffffff">
                                                    <path
                                                        d="m17.826 3.774-3.6-3.6A.6.6 0 0 0 13.8 0h-1.2v4.8A1.2 1.2 0 0 1 11.4 6H6.6a1.2 1.2 0 0 1-1.2-1.2V0H1.8A1.8 1.8 0 0 0 0 1.8v14.4A1.8 1.8 0 0 0 1.8 18H3v-5.4a1.8 1.8 0 0 1 1.8-1.8h8.4a1.8 1.8 0 0 1 1.8 1.8V18h1.2a1.8 1.8 0 0 0 1.8-1.8v-12a.6.6 0 0 0-.174-.426Z"
                                                        data-name="Path 26324"
                                                    />
                                                    <path
                                                        d="M6.6 0h4.8v4.8H6.6Z"
                                                        data-name="Path 26325"
                                                    />
                                                    <path
                                                        d="M13.2 12H4.8a.6.6 0 0 0-.6.6V18h9.6v-5.4a.6.6 0 0 0-.6-.6Z"
                                                        data-name="Path 26326"
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                        {{ isLoading ? 'Saving..' : 'Save' }}
                                    </button>
                                </div>
                            </VForm>
                        </div>
                    </PopoverPanel>
                </transition>
            </Popover>
        </div>
    </div>
</template>
