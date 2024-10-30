<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { XCircleIcon } from '@heroicons/vue/24/solid';
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

    groups: {
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
    name: '',
    weight: '',
    item_names: [],
};

const schema = object({
    name: string().required().max(80).label('Name'),
    weight: string().required().max(4).label('Score'),
});

const setGroupEditInfo = (values: Object) => {
    initialValues.id = values.id;
    initialValues.name = values.name;
    initialValues.weight = values.weight;
    initialValues.item_names = values.group_item ? values.group_item.map((item: object) => item.name) : [];
};

const $emit = defineEmits(['onUpdate', 'deleteGroup', 'deleteGroupItem']);
</script>

<template>
    <slot name="default"></slot>
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

                <Disclosure
                    v-for="(group, index) in props.groups"
                    v-else
                    :key="index"
                    v-slot="{ open }"
                    as="div"
                    class="h-auto space-x-2 bg-slate-100 p-4"
                >
                    <div class="flex w-full items-center justify-between">
                        <DisclosureButton>
                            <div class="flex items-center">
                                <ChevronDownIcon
                                    class="mr-3 h-5 w-5 text-slate-600"
                                    :class="open ? 'rotate-180 transform' : ''"
                                />
                                <p class="font-poppins-regular text-base font-semibold text-slate-800">
                                    {{ group.name }}
                                    <span v-if="group.group_item">({{ group.group_item.length }})</span>
                                </p>
                            </div>
                        </DisclosureButton>

                        <div class="flex items-center">
                            <div class="pr-28">
                                <p class="font-poppins-regular text-slate-500">Score: {{ group.weight }}</p>
                            </div>

                            <div class="flex items-center space-x-2">
                                <Popover class="relative flex items-center">
                                    <PopoverButton @click="setGroupEditInfo(group)">
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
                                            <div
                                                class="min-h-[17rem] w-[19.75rem] rounded-lg bg-white p-6 shadow-follow-up"
                                            >
                                                <VForm
                                                    :validation-schema="schema"
                                                    :initial-values="initialValues"
                                                    @submit="$emit('onUpdate', { $event, close })"
                                                >
                                                    <div class="mb-4">
                                                        <label
                                                            for="name"
                                                            class="font-poppins-regular mb-2 block text-sm font-medium text-gray-900"
                                                        >
                                                            Name
                                                        </label>
                                                        <VField
                                                            id="name"
                                                            ref="name"
                                                            name="name"
                                                            type="text"
                                                            class="font-poppins-regular block w-full rounded-sm border border-slate-300 bg-white py-2.5 pl-4 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                                                            placeholder="Enter C/C Group Name"
                                                        />
                                                        <VErrorMessage
                                                            name="name"
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
                                        @click="$emit('deleteGroup', group)"
                                    />
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel class="text-gray-500">
                        <div class="mt-2">
                            <slot
                                name="search"
                                :group-item="group"
                            ></slot>

                            <button
                                v-for="(drug, indexr) in group.group_item"
                                :key="indexr"
                                class="mr-3 mt-3 inline-flex cursor-default items-center rounded-full bg-slate-200 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-300"
                            >
                                <div
                                    v-if="drug"
                                    class="inline-flex items-center space-x-2"
                                >
                                    <img
                                        class="h-4 w-4"
                                        :src="drug.dosage_form.icon_url"
                                        alt=""
                                    />
                                    <span class="font-poppins-regular text-base font-normal">
                                        {{ drug.name }} {{ drug.strength }}</span
                                    >
                                </div>
                                <XCircleIcon
                                    class="ml-3 h-5 w-5 cursor-pointer rounded-full text-slate-500 outline-offset-0 ring-1 ring-transparent hover:text-red-500 hover:ring-red-200"
                                    @click="
                                        $emit('deleteGroupItem', {
                                            group_id: group.id,
                                            item_id: drug.id,
                                        })
                                    "
                                />
                            </button>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </fieldset>
    </div>
</template>
