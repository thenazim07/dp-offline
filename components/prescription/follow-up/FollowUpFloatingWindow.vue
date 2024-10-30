<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useDateFormat } from '@vueuse/core';
import { usePrescriptionFollowUpStore } from '~/stores/prescription/followUp/index';
import { useFollowUpStoreRoot } from '~/stores/prescription/useFollowUpStoreRoot';
const followUpStore = usePrescriptionFollowUpStore();
const followUpStoreRoot = useFollowUpStoreRoot();
const { searchFollowUp } = followUpStore;
const hasSearchResult = ref<boolean>(false);
const { fields, duration_types_for_follow_up } = storeToRefs(useConfigsStore());

const follow_up_duration = computed(() => fields.value?.e_prescription.follow_up_duration_types);

const selectAdvice: Ref<[]> = ref([]);

const { followUp, isShowingFollowUpEditor, followUpNotes, followUpAdvice, selectedFollowUpListIndexToFocus } =
    storeToRefs(followUpStoreRoot);

const { inputClassToFocus, focusOnSpecificNodelListIndexInput } = useFocusOnParentElementsLastInputElement();

const container = ref<HTMLDivElement | null>(null);
const scrollableDivRef = ref<HTMLElement | null>(null);

onClickOutside(
    container,
    () => {
        if (
            useHasUniquePropertyValuesOfObjects(
                followUpAdvice.value.filter((singleNote) => singleNote.name.trim() !== ''),
                'name',
            )
        ) {
            isShowingFollowUpEditor.value = false;
        }
    },
    {
        ignore: [document.querySelector('.FollowUpSectionClass'), document.getElementById('teleports')],
    },
);

const isFirstRender = ref(true);

// const customItemAdd = (searchQuery: string): any => {
//     if (!searchQuery) return;
//     addNewItem({ name: searchQuery, uuid: getUuid(searchQuery) });
//     searchValue.value = '';
// };

function customItemAdd(item) {
    // console.log(item);
}

const configStyle = {
    wrapper: 'mb-4 max-1919:mb-3 h-[230px] max-1919:h-[172px] ',
    base: 'bg-white',
    input: {
        wrapper: 'bg-white',
    },
    group: {
        label: 'bg-white',
        container: 'flex flex-wrap scroll-auto mt-4 ml-4 max-1919:ml-2 max-1919:mt-2 ',
        command: {
            base: 'bg-white border rounded-full mb-2 mr-2',
            active: 'border-blue-500 text-blue-500',
        },
    },
    active: 'border-blue-500 text-blue-500',
};

async function onFollowUpListClickHandler() {
    if (selectedFollowUpListIndexToFocus.value == null) {
        focusOnFollowUpDateInput();
    } else {
        focusOnSpecificNodelListIndexInput(
            scrollableDivRef.value,
            inputClassToFocus,
            selectedFollowUpListIndexToFocus.value,
        );
    }

    await nextTick();
    selectedFollowUpListIndexToFocus.value = null;
}

function focusOnFollowUpDateInput() {
    setTimeout(() => {
        document
            .querySelectorAll('.' + inputClassToFocus)[0]
            .getElementsByTagName('INPUT')[0]
            .focus();
    }, 100);
}

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
watch(
    () => followUp,
    () => {
        if (isFirstRender.value) {
            isFirstRender.value = false;
        }
    },
    { deep: true },
);

function dateFormat(date: Date) {
    return useDateFormat(date, 'YYYY-MM-DD').value;
}

const followUpDate = computed({
    get: () => new Date(followUp.value.date),
    set: (value) => {
        followUp.value.follow_up_date = dateFormat(value);
        followUp.value.within = '';
        followUp.value.duration_type = '';
        followUp.value.duration = '';
        followUp.value.date = dateFormat(value);
    },
});

const duration = computed({
    get: () => followUp?.value?.duration?.toString() || '',
    set: (value) => {
        followUp.value.duration = value;
        followUp.value.within = `${value} ${followUp.value.duration_type}`;
        followUp.value.follow_up_date = '';
        followUp.value.date = '';
    },
});

const durationType = computed({
    get: () => followUp?.value?.duration_type?.toString() || '',
    set: (value) => {
        followUp.value.duration_type = value;
    },
});

const durationLocale = computed({
    get: () => followUp?.value?.duration_locale?.toString() || 'en',
    set: (value) => {
        followUp.value.duration_locale = value;
    },
});

onMounted(async () => {
    await onFollowUpListClickHandler();
});

onUnmounted(async () => {
    if (duration.value || followUp.value.date) {
        await followUpStoreRoot.syncWithServer();
    } else if (followUp.value.ref) {
        await followUpStoreRoot.deleteFollowUp();
    } else {
        followUpStoreRoot.$reset();
    }
});

// function onDeleteClickHandler(noteIndex: number) {
//     followUpStoreRoot.deleteFollowUpNote(noteIndex);
// }
</script>

<template>
    <div
        ref="container"
        class="z-10 rounded-lg bg-slate-200 p-3"
    >
        <div class="mb-3">
            <PrescriptionCommonPrescriptionSectionTitle
                title="Follow Up"
                :show-icon="false"
            />
        </div>
        <div class="w-full bg-slate-100 pl-2 pr-[10px] pt-3">
            <div class="flex items-center gap-2">
                <p>within</p>
                <div :class="`flex divide-x rounded ${inputClassToFocus}`">
                    <!-- <input
                        v-model="duration"
                        type="number"
                        class="border-none"
                        @keydown="checkDigit"
                    />
                    <div>
                        <select
                            v-model="followUp.duration_type"
                            class="border-none"
                        >
                            <option
                                v-for="(duration, key) in follow_up_duration"
                                :value="key"
                            >
                                {{ duration }}
                            </option> -->
                    <!-- <option value="weeks">week</option>
                            <option value="months">month</option> -->
                    <!-- </select>
                    </div> -->
                    <DurationCalculator
                        v-model:model-value-duration-lang="durationLocale"
                        v-model:model-value-duration-number="duration"
                        v-model:model-value-duration-type="durationType"
                        :shown-duration-types="duration_types_for_follow_up"
                        duration-locale-persist-store-type="follow_up"
                    />
                </div>
                <p>or</p>
                <div class="flex-grow">
                    <VueDatePicker
                        v-model="followUpDate"
                        :enable-time-picker="false"
                        placeholder="Date"
                        :min-date="new Date()"
                        auto-apply
                        :format="dateFormat"
                    >
                        <template #dp-input="{ value }">
                            <div class="flex cursor-pointer rounded bg-white">
                                <div
                                    v-if="value.length < 2"
                                    class="flex w-full items-center divide-x pl-2"
                                >
                                    <p class="m-0 flex flex-grow p-0 py-2 text-slate-600">
                                        {{ value.length > 2 ? value : 'Select Date' }}
                                    </p>

                                    <button class="flex px-2">
                                        <LibIconCalender class="h-8 w-8" />
                                    </button>
                                </div>
                                <p
                                    v-else
                                    class="mr-14 flex-grow self-stretch border-r border-gray-500 py-2 pl-2 text-slate-600"
                                >
                                    {{ value }}
                                </p>
                            </div>
                        </template>
                        <template #clear-icon>
                            <button class="m-0 mr-4 flex p-0">
                                <LibIconCalender class="h-8 w-8" />
                            </button>
                        </template>
                    </VueDatePicker>
                </div>
            </div>

            <!-- <div class="mt-4 max-h-96 overflow-y-auto rounded-lg border-8 border-slate-200 bg-white">
                <UCommandPalette
                    v-model="followUpNotes"
                    multiple
                    nullable
                    :ui="configStyle"
                    :groups="groups"
                    command-attribute="name"
                    :autoselect="false"
                    by="name"
                    :autoclear="false"
                    :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
                    @keyup.enter="($event: any) => customItemAdd($event?.target?.value)"
                />
            </div> -->
            <div class="mt-4 border-spacing-0 border-t border-dashed border-slate-400"></div>
            <div
                ref="scrollableDivRef"
                class="mt-6 max-h-[250px] min-h-[220px] space-y-2 overflow-y-auto bg-slate-100 pb-[38px] pl-2 pr-[10px] pt-3 scrollbar-thin scrollbar-stable max-1919:mt-4 max-1919:h-[231px] max-1599:mt-3 max-1599:max-h-[152px] max-1599:min-h-[152px]"
            >
                <PrescriptionFollowUpFloatingComponentFormFollowUpNotesInput
                    v-for="(advice, index) in followUpAdvice"
                    :key="advice?.uuid || advice?.ref || advice?.name"
                    :follow-up-advice="advice"
                    :index="index"
                    :is-removable="index !== followUpAdvice.length - 1"
                />
                <!-- :autofocus="isFirstRender && index === advices.length - 1" -->
            </div>
            <!-- <div
                class="h-[144px] space-y-2 overflow-y-auto pb-4 pl-4 pr-2 pt-4 scrollbar-thin scrollbar-stable max-1919:h-[136px]"
            >
                <div
                    v-for="(note, noteIndex) in followUpNotes"
                    :key="note?.id || note?.uuid || note?.name || note?.content"
                    class="flex items-center justify-between gap-4"
                >
                    <span class="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300">&nbsp;</span>
                    <div class="flex flex-grow items-center justify-between gap-4">
                        <p class="flex-grow pr-2 text-justify">
                            {{ note?.name || note?.content }}
                        </p>
                        <button
                            type="button"
                            @click.prevent="onDeleteClickHandler(noteIndex)"
                        >
                            <TrashIcon class="h-6 w-6 font-semibold text-red-600" />
                        </button>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>
