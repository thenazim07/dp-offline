<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useConfigsStore } from '~/stores/useConfigsStore';
import type { IIndication } from '~/repository/modules/Prescription/IndicationModule/types';
import { useChiefComplaintsStoreRoot } from '~/stores/prescription/useChiefComplaintsStoreRoot';
import { useChiefComplaintsStore } from '~/stores/prescription/useChiefComplaintsStore';
const { durationTypes, duration_types_for_indication } = storeToRefs(useConfigsStore());

const chiefComplaintsStoreRoot = useChiefComplaintsStoreRoot();
const chiefComplaintStore = useChiefComplaintsStore();
const { isGroupMode, currentGroup, indicationsSearchList, chiefComplaints } = storeToRefs(chiefComplaintsStoreRoot);
const cheifComplainListInputRef = ref<HTMLDivElement | null>(null);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();

const props = withDefaults(
    defineProps<{
        indication?: IIndication;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
        isLastElement?: boolean;
    }>(),
    {
        indication: () => ({}) as IIndication,
        index: undefined,
        autofocus: false,
        isRemovable: true,
        isLastElement: false,
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

const note = computed({
    get: () => props.indication.value,
    set: (value) => chiefComplaintsStoreRoot.updateIndication(props.index!, 'value', value),
});

const duration = computed({
    get: () => props.indication.duration || '',
    set: (value) => chiefComplaintsStoreRoot.updateIndication(props.index!, 'duration', value),
});

const durationType = computed({
    get: () => props.indication.duration_type,
    set: (value) => chiefComplaintsStoreRoot.updateIndication(props.index!, 'duration_type', value),
});

const durationLocale = computed({
    get: () => props.indication?.duration_locale || 'en',
    set: (value) => chiefComplaintsStoreRoot.updateIndication(props.index!, 'duration_locale', value),
});

function deleteItem() {
    chiefComplaintsStoreRoot.deleteIndication(props.index!);
}

const loading = ref(false);
const isFirstTime = ref(true);
async function search(q: string) {
    loading.value = true;

    if (isFirstTime.value) {
        isFirstTime.value = false;
    } else {
        indicationsSearchList.value = await chiefComplaintStore.searchChiefComplaintsTest(q);
    }
    loading.value = false;
}

const query = computed({
    get: () => props.indication.name,
    set: (value) => {
        chiefComplaintsStoreRoot.updateIndication(props.index!, 'name', value);

        checkDuplicateChiefComplaint(value);
    },
});

function checkDuplicateChiefComplaint(value: string) {
    if (value.trim()) {
        if (chiefComplaints.value.filter((complaint) => complaint.name.trim() === value.trim()).length !== 1) {
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
    focusToParentElementsLastChildsFirstInput(cheifComplainListInputRef, `.${inputClassToFocus}`);
};

async function onInputFocusHandlerDropDownShow(event: Event) {
    event?.target?.parentNode?.getElementsByTagName('button')[0].click();
    indicationsSearchList.value = await chiefComplaintStore.searchChiefComplaintsTest('');
}

async function customFetchFunction(query: string) {
    loading.value = true;
    indicationsSearchList.value = await chiefComplaintStore.searchChiefComplaintsTest(query);
    loading.value = false;

    return indicationsSearchList.value;
}
async function handleSelect() {
    await nextTick(); // Ensure the DOM is updated

    if (!checkDuplicateChiefComplaint(props.indication.name)) focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="cheifComplainListInputRef"
        class="flex w-full items-center justify-between gap-2"
    >
        <LibIconHamBurger />
        <div class="relative w-[80%]">
            <!-- <UInputMenu
                v-model="query"
                v-model:query="query"
                :options="indicationsSearchList"
                :loading="loading"
                :debounce="500"
                trailing
                placeholder="Write your chief complaint here..."
                option-attribute="name"
                value-attribute="name"
                :popper="{
                    strategy: 'fixed',
                }"
                :autofocus="props.autofocus"
                :ui="searchInputConfig"
                @keyup="(e: Event) => search(e.target.value)"
                @keyup.enter="focusOnParentElementsLastInputElement"
                @focus="onInputFocusHandlerDropDownShow"
                @open="
                    (ev) => {
                        console.log('open ....', ev);
                    }
                "
            >
                <template #option="{ option: names }">
                    <span
                        v-for="name in names"
                        :key="name"
                        class="h-2 w-2 rounded-full"
                    />
                    <span class="w-6 h-6">{{ names.name }}</span>
                </template>
            </UInputMenu> -->
            <AutoComplete
                v-model="query"
                :initial-suggestions="[]"
                :fetch-suggestions="customFetchFunction"
                :autofocus="props.autofocus"
                rootClass=""
                inputParentClass=""
                :inputClass="inputClassToFocus"
                ulClass=""
                liClass=""
                :initial-api-call="props.autofocus"
                @select="handleSelect"
                @on-enter="focusOnParentElementsLastInputElement"
            />
        </div>

        <div class="flex flex-shrink items-center rounded">
            <!-- <input
                v-model="duration"
                type="text"
                class="w-[30%] rounded-l border-none p-3"
                placeholder="0"
                @keyup.enter="focusOnParentElementsLastInputElement"
            /> -->
            <!-- <div class="w-0.5 self-stretch bg-slate-200"></div> -->
            <!-- <select
                v-model="durationType"
                class="flex-grow rounded-r border-none p-3"
            >
                <option
                    v-if="durationTypes.length === 0"
                    value="Days"
                >
                    Days
                </option>
                <option
                    v-for="(_durationType, _durationTypeKey) in durationTypes"
                    v-else
                    :key="_durationType"
                    :value="_durationTypeKey"
                >
                    {{ _durationType }}
                </option>
            </select> -->
            <DurationCalculator
                v-model:model-value-duration-number="duration"
                v-model:model-value-duration-type="durationType"
                v-model:model-value-duration-lang="durationLocale"
                :shown-duration-types="duration_types_for_indication"
                duration-locale-persist-store-type="chief_complaint"
                @key-down-enter="focusOnParentElementsLastInputElement"
            />
        </div>

        <div class="flex w-[40%]">
            <textarea
                v-model="note"
                placeholder="Note"
                rows="1"
                class="w-full resize-none rounded border-none p-3"
                @keydown.enter.exact.prevent="focusOnParentElementsLastInputElement"
            ></textarea>
        </div>

        <div
            v-if="props.isRemovable"
            class="w-[3%]"
        >
            <input
                v-if="isGroupMode"
                v-model="currentGroup.items"
                type="checkbox"
                :value="query"
            />

            <button
                v-else
                type="button"
                @click.prevent="deleteItem"
            >
                <TrashIcon class="h-6 w-6 font-semibold text-red-600" />
            </button>
        </div>
        <div
            v-else
            class="w-[3%]"
        >
            <div class="h-6 w-6"></div>
        </div>
    </div>
</template>
