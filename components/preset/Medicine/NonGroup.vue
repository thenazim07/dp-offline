<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { object, string } from 'yup';

const props = defineProps({
    title: {
        type: String,
        default: '',
        required: true,
    },

    hasFound: {
        type: Boolean,
        default: false,
        required: true,
    },

    presets: {
        type: [Array, Object],
        default: null,
        required: true,
    },

    updateLoading: {
        type: Boolean,
        default: false,
        required: true,
    },

    placeholder: {
        type: String,
        default: '',
        required: false,
    },
});

const initialValues: Object = {
    id: null,
    item_name: '',
    weight: '',
    description: [],
};

const schema = object({
    item_name: string().required().max(80).label('Name'),
    weight: string().required().max(4).label('Score'),
});

const setEditInfo = (item: Object) => {
    initialValues.id = item?.id;
    initialValues.item_name = item?.name;
    initialValues.item_id = item?.item_id;
    initialValues.weight = item?.weight;
    initialValues.description = item.description;
};

const $emit = defineEmits(['onUpdate', 'deleteItem']);
</script>

<template>
    <div class="mb-4">
        <slot></slot>
    </div>

    <div>
        <fieldset>
            <div class="tmt-4 divide-y-2 divide-white border-gray-200">
                <div
                    v-if="hasFound"
                    class="h-14 bg-slate-100 p-4"
                >
                    <div>
                        <p class="font-poppins-regular text-center text-base text-gray-700">No data Found</p>
                    </div>
                </div>

                <div
                    v-for="(drug, index) in props.presets"
                    v-else
                    :key="index"
                    class="h-auto space-x-2 bg-slate-100 p-4"
                >
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div
                                v-if="drug"
                                class="inline-flex items-center space-x-2"
                            >
                                <img
                                    class="h-5 w-5"
                                    :src="drug.dosage_form.icon_url"
                                    alt=""
                                />
                                <span class="font-poppins-regular text-base font-normal">
                                    {{ drug.name }} {{ drug.strength }}</span
                                >
                            </div>
                        </div>

                        <div class="flex items-center">
                            <div class="pr-28">
                                <p class="font-poppins-regular text-sm text-slate-500 2xl:text-base">
                                    Score: {{ drug.weight }}
                                </p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Popover class="relative flex items-center">
                                    <PopoverButton @click="setEditInfo(drug)">
                                        <PencilSquareIcon class="h-5 w-5 cursor-pointer text-slate-500" />
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
                                            class="absolute right-[1rem] top-3 z-10"
                                        >
                                            <div class="h-auto w-[19.75rem] rounded-lg bg-white p-6 shadow-follow-up">
                                                <VForm
                                                    :validation-schema="schema"
                                                    :initial-values="initialValues"
                                                    @submit="$emit('onUpdate', { $event, close })"
                                                >
                                                    <div class="mb-4">
                                                        <label
                                                            for="item_name"
                                                            class="font-poppins-regular mb-2 block text-sm font-medium text-gray-900"
                                                        >
                                                            Name
                                                        </label>
                                                        <VField
                                                            id="item_name"
                                                            ref="item_name"
                                                            disabled
                                                            name="item_name"
                                                            type="text"
                                                            class="font-poppins-regular block w-full rounded-sm border border-slate-300 bg-slate-100 py-2.5 pl-4 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                                                            placeholder="Enter Medicine"
                                                        />
                                                        <VErrorMessage
                                                            name="item_name"
                                                            class="font-poppins-regular text-xs italic text-red-500"
                                                        ></VErrorMessage>
                                                    </div>

                                                    <div class="mb-6">
                                                        <label
                                                            for="weight"
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
                                                            :class="
                                                                updateLoading
                                                                    ? 'bg-slate-400'
                                                                    : 'bg-skin-button-accent hover:bg-skin-button-accent-hover'
                                                            "
                                                            class="tracking-wides inline-flex w-full items-center justify-center rounded-md border border-transparent py-3 text-center text-xs font-semibold text-white transition focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25"
                                                        >
                                                            <LibIconLoadingCircle v-if="updateLoading" />
                                                            <span
                                                                v-else
                                                                class="mr-2 block h-5 w-5 cursor-pointer rounded-full bg-skin-fill p-px ring ring-transparent hover:ring-blue-200"
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
                                                            {{ updateLoading ? 'Updating...' : 'Update' }}
                                                        </button>
                                                    </div>
                                                </VForm>
                                            </div>
                                        </PopoverPanel>
                                    </transition>

                                    <TrashIcon
                                        class="ml-3 h-5 w-5 cursor-pointer text-red-500"
                                        @click="$emit('deleteItem', drug)"
                                    />
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>
</template>
