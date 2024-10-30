<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useOtherHistoryStoreRoot } from '~/stores/ehr/useOtherHistoryRoot';
import type { ISurgicalStoreData } from '~/repository/modules/EHR/OtherHistory/types';

const otherHistoryStoreRoot = useOtherHistoryStoreRoot();
const { surgicalType, surgicalList } = storeToRefs(otherHistoryStoreRoot);
const surgicalInputRef = ref<HTMLDivElement | null>(null);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();
const { duration_types_for_past_history_others } = storeToRefs(useConfigsStore());


const props = withDefaults(
    defineProps<{
        surgical?: ISurgicalStoreData;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        surgical: () => ({}) as ISurgicalStoreData,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

const searchInputConfig = {
    wrapper: '',
    base:
        inputClassToFocus +
        ' w-full ring-0 shadow-none rounded-lg p-3.5 border focus:border-blue-500 border-slate-300 bg-white leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm',
    padding: 'py-3 pl-10 pr-3',
    color: {
        white: {
            outline: 'shadow-none ring-0 focus:ring-0 focus:outline-border-blue-600 focus:ring-blue-600',
        },
    },
};

const duration = computed({
    get: () => props?.surgical?.duration?.toString() || '',
    set: (value) => otherHistoryStoreRoot.updateSurgical(props.index!, 'duration', Number(value) !== 0 ? Number(value) : null),
});

const durationType = computed({
    get: () => props.surgical.duration_type,
    set: (value) => otherHistoryStoreRoot.updateSurgical(props.index!, 'duration_type', value),
});

const durationLocale = computed({
    get: () => props.surgical?.duration_locale || 'en',
    set: (value) => otherHistoryStoreRoot.updateSurgical(props.index!, 'duration_locale', value),
});

function deleteItem() {
    otherHistoryStoreRoot.deleteSurgical(props.index!);
}

const query = computed({
    get: () => props.surgical.name,
    set: (value) => {
        otherHistoryStoreRoot.updateSurgical(props.index!, 'name', value);

        ckeckDuplicateSurgicals(value);
    },
});

function ckeckDuplicateSurgicals(value: string) {
    if (value.trim()) {
        if (surgicalList.value.filter((surgical) => surgical.name.trim() === value.trim()).length !== 1) {
            document.getElementsByClassName(inputClassToFocus)[props.index!].style.borderColor = 'red';
            document.getElementsByClassName(inputClassToFocus)[props.index!].classList.add('focus:ring-red-500');
            return true;
        } else {
            document.getElementsByClassName(inputClassToFocus)[props.index!].style.borderColor = '#e2e8f0';
            document.getElementsByClassName(inputClassToFocus)[props.index!].classList.remove('focus:ring-red-500');
            return false;
        }
    } else {
        document.getElementsByClassName(inputClassToFocus)[props.index!].style.borderColor = '#e2e8f0';
        document.getElementsByClassName(inputClassToFocus)[props.index!].classList.remove('focus:ring-red-500');
        return false;
    }
}

const focusOnParentElementsLastInputElement = () => {
    focusToParentElementsLastChildsFirstInput(surgicalInputRef, `.${inputClassToFocus}`);
};

function onInputFocusHandlerDropDownShow(event: Event) {
    event?.target?.parentNode?.getElementsByTagName('button')[0].click();
}

async function customFetchFunction(query: string) {
    return [];
}

async function handleSelect() {
    await nextTick(); // Ensure the DOM is updated

    if (!ckeckDuplicateSurgicals(props.surgical.name)) focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="surgicalInputRef"
        class="flex w-full items-center justify-between gap-2"
    >
        <LibIconHamBurger />
        <div class="relative w-[80%]">
            <!-- <UInputMenu
                v-model="query"
                v-model:query="query"
                :options="surgicalType"
                trailing
                placeholder="Write your surgical history here..."
                option-attribute="name"
                value-attribute="name"
                :autofocus="props.autofocus"
                :ui="searchInputConfig"
                :ui-menu="{
                    width: 'w-[57%]',
                }"
                :popper="{
                    strategy: 'fixed',
                    placement: 'left-start',
                    offsetDistance: -50,
                    offsetSkid: 60,
                }"
                @keyup.enter="focusOnParentElementsLastInputElement"
                @focus="onInputFocusHandlerDropDownShow"
            /> -->

            <AutoComplete
                v-model="query"
                :initial-suggestions="surgicalType"
                :fetch-suggestions="customFetchFunction"
                :autofocus="props.autofocus"
                rootClass=""
                inputParentClass=""
                :inputClass="inputClassToFocus"
                ulClass=""
                liClass=""
                :use-search-api="false"
                :initial-api-call="false"
                @select="handleSelect"
                @on-enter="focusOnParentElementsLastInputElement"
            />
        </div>

        <div>
            <PrescriptionBaseComponentsDurationWithType
                v-model:duration="duration"
                v-model:duration-type="durationType"
                v-model:duration-locale="durationLocale"
                :shown-duration-types="duration_types_for_past_history_others"
                duration-locale-persist-store-type="past_history_others"
                class="flex-1 rounded border"
                @onInputKeyUpEnterHandler="focusOnParentElementsLastInputElement"
            />
        </div>

        <div
            v-if="props.isRemovable"
            class="w-[3%]"
        >
            <button
                type="button"
                @click.prevent="deleteItem"
            >
                <TrashIcon class="h-6 w-6 font-semibold text-red-600" />
            </button>
        </div>

        <div
            v-else
            class="w-[3%]"
        ></div>
    </div>
</template>
