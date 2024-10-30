<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import { format } from 'date-fns';
import '@vuepic/vue-datepicker/dist/main.css';
import { usePrescriptionFollowUpStore } from '~/stores/prescription/followUp/index';

const { hasSelectedPatient } = managePrescription();
const followUpStore = usePrescriptionFollowUpStore();
const { createFollowUp, createFollowUpNote, searchFollowUp } = followUpStore;
const { followup } = storeToRefs(followUpStore);
const toast = useToast();
const hasSearchResult = ref(false);
const isOpen: Ref<boolean> = ref(false);
const selectAdvice: Ref<[]> = ref([]);
const selectDurationTypeOrDate = ref('');
const validationMessage = ref(false);
const formData = ref({
    follow_up_date: null,
    duration: undefined,
    duration_type: 'days',
});

const configStyle = {
    wrapper: 'mb-4',
    base: 'bg-white',
    input: {
        wrapper: 'bg-white',
    },
    group: {
        label: 'bg-white',
        container: 'flex flex-wrap',
        command: {
            base: 'bg-white border rounded-full mb-2 mr-2',
            active: 'border-blue-500 text-blue-500',
        },
    },
    active: 'border-blue-500 text-blue-500',
};

const groups = [
    {
        key: 'advice',
        search: async (q: string) => {
            const advice = await searchFollowUp(q);
            if (advice && advice.length > 0) {
                hasSearchResult.value = true;
            } else {
                hasSearchResult.value = false;
            }
            return advice;
        },
    },
];

const switchFollowUpDurationOption = (optionName = 'duration') => {
    if (optionName === 'duration') {
        selectDurationTypeOrDate.value = '';
        formData.value.follow_up_date = null;
    }
    if (optionName === 'calendar') {
        formData.value.duration = undefined;
        formData.value.duration_type = 'days';
    }
};

function openModalAndSetAdvice() {
    if (!hasSelectedPatient.value) {
        toast.add({ title: 'Please select a patient before proceeding', color: 'rose' });
        return false;
    }

    isOpen.value = true;

    if (followup.value.within && followup.value?.follow_up_notes) {
        selectAdvice.value = followup.value.follow_up_notes.map(({ content, id, ref }) => ({
            name: content,
            id,
            ref: ref ?? null,
        }));
    }
}

function customItemAdd(value: string) {
    if (!value || hasSearchResult.value) return;

    const itemExists = selectAdvice.value.some((item: { name: string }) => item.name === value);

    if (itemExists) {
        toast.add({ title: 'Item already exists', color: 'red' });
        return;
    }

    selectAdvice.value.push({ name: value });
}

function removeItem(name: string) {
    selectAdvice.value.splice(getIndex(name), 1);
}

function getIndex(name: string) {
    return selectAdvice.value.findIndex((item: { name: string }) => item.name === name);
}

const followUpSubmit = () => {
    // validation
    if (!formData.value.duration && !formData.value.follow_up_date && selectAdvice.value.length > 0) {
        validationMessage.value = true;
        setTimeout(() => {
            validationMessage.value = false;
        }, 3000);
        return;
    }

    isOpen.value = false;
    // store data
    createFollowUp(formData.value);
    createFollowUpNote(selectAdvice.value);

    // reset form data
    formData.value = {
        follow_up_date: null,
        duration: undefined,
        duration_type: 'days',
    };

    selectAdvice.value = [];
};

// computed
const showInfo = computed(() => {
    const { duration, duration_type } = formData.value;
    if (duration && duration_type) {
        return `${duration} ${duration_type === 'days' ? 'দিন' : duration_type === 'weeks' ? 'সপ্তাহ' : 'মাস'} পরে`;
    }
    return formData.value.follow_up_date ? `${format(formData.value.follow_up_date, 'yyyy-MM-dd')} তারিখে` : '';
});

const isDuration = computed(() => {
    return !!formData.value.follow_up_date || !!formData.value.duration;
});
</script>

<template>
    <div class="pb-16">
        <LibButtonsPrescriptionFeatureButton
            :is-disabled="!hasSelectedPatient"
            @click="openModalAndSetAdvice"
        >
            Follow Up
        </LibButtonsPrescriptionFeatureButton>

        <PrescriptionFollowUpList></PrescriptionFollowUpList>

        <UModal
            v-model="isOpen"
            :ui="{
                width: 'w-full lg:max-w-3xl',
                height: '2xl:max-h-[45rem]',
            }"
            :closeable="false"
            title="Follow-up"
            prevent-close
        >
            <ClientOnly>
                <div class="px-8 pb-8">
                    <PrescriptionBaseComponentsModalHeader
                        title="Follow-up within:"
                        @modal:close="followUpSubmit()"
                    />

                    <div class="relative mb-5 flex w-full items-center">
                        <div class="relative mt-2 w-full">
                            <input
                                v-model="formData.duration"
                                type="number"
                                class="block h-12 w-full rounded-sm border-0 pl-3 pr-20 text-gray-900 [appearance:textfield] placeholder:text-gray-400 hover:border-blue-300 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6"
                                placeholder="0"
                                @change="switchFollowUpDurationOption('duration')"
                                @keyup.enter="switchFollowUpDurationOption('duration')"
                                @keydown="switchFollowUpDurationOption('duration')"
                            />
                            <div class="absolute inset-y-0 right-0 flex items-center">
                                <label
                                    for="duration"
                                    class="sr-only"
                                >
                                    Duration
                                </label>
                                <select
                                    id="duration"
                                    v-model="formData.duration_type"
                                    name="duration"
                                    :class="false ? 'opacity-25' : ' opacity-100'"
                                    class="font-poppins-regular h-full border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                >
                                    <option
                                        value="days"
                                        selected
                                    >
                                        Day
                                    </option>
                                    <option value="weeks">Week</option>
                                    <option value="months">Month</option>
                                </select>
                            </div>
                        </div>

                        <div class="mx-2 w-6 text-center">
                            <p class="font-poppins-regular text-base font-normal text-slate-500">or</p>
                        </div>

                        <div class="relative mt-2 w-full cursor-pointer border hover:border-blue-300">
                            <div
                                id="follow-up"
                                class="flex h-12 items-center"
                            >
                                <VueDatePicker
                                    v-model="formData.follow_up_date"
                                    :enable-time-picker="false"
                                    placeholder="Date"
                                    :min-date="new Date()"
                                    @update:model-value="switchFollowUpDurationOption('calendar')"
                                >
                                    <template #dp-input="{ value }">
                                        <div
                                            v-if="value.length < 2"
                                            class="flex w-full items-center justify-between"
                                        >
                                            <p class="m-0 flex p-0 pl-4 text-slate-600">
                                                {{ value.length > 2 ? value : 'Select Date' }}
                                            </p>

                                            <button class="m-0 mr-4 flex p-0">
                                                <LibIconCalender class="h-8 w-8" />
                                            </button>
                                        </div>
                                        <p
                                            v-else
                                            class="pl-4 text-slate-600"
                                        >
                                            {{ value }} asdfasdfasdfsdaf
                                        </p>
                                    </template>
                                    <template #clear-icon>
                                        <button class="m-0 mr-4 flex p-0">
                                            <LibIconCalender class="h-8 w-8" />
                                        </button>
                                    </template>
                                </VueDatePicker>
                            </div>
                        </div>

                        <span
                            v-if="validationMessage"
                            class="absolute -bottom-6 right-0 text-sm text-red-500"
                        >
                            Please select duration or date
                        </span>
                    </div>

                    <div class="mb-5 rounded-lg bg-slate-50 p-3">
                        <div class="mb-3">
                            <UCommandPalette
                                v-model="selectAdvice"
                                multiple
                                nullable
                                :ui="configStyle"
                                :groups="groups"
                                command-attribute="name"
                                :autoselect="false"
                                :autoclear="false"
                                :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
                                @keyup.enter="($event: any) => customItemAdd($event?.target?.value)"
                            />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center">
                            <h5 class="font-poppins-regular mr-2 font-semibold">Follow-up</h5>
                            <span
                                v-show="isDuration"
                                class="font-meduim mr-1 text-sm capitalize text-slate-600"
                            >
                                ({{ showInfo }})
                            </span>
                        </div>

                        <div class="max-h-[150px] overflow-auto px-2">
                            <ul class="list-disc pl-3">
                                <li
                                    v-for="item in selectAdvice"
                                    :key="item.name"
                                    class="group font-normal text-slate-500"
                                >
                                    <div class="flex w-full items-start justify-between">
                                        <p
                                            class="transation group-focus:text-meduim gorup-focus:text-slate-800 group-hover:font-meduim pr-4 text-justify duration-500 group-hover:text-slate-800"
                                        >
                                            {{ item.name }}
                                        </p>
                                        <button
                                            class="m-0 p-0"
                                            @click="removeItem(item.name)"
                                        >
                                            <UIcon
                                                class="text-red-500"
                                                name="i-heroicons-trash"
                                            />
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </UModal>
    </div>
</template>
