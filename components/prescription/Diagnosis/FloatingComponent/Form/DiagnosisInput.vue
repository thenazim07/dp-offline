<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useDiagnosisStoreRoot } from '~/stores/prescription/useDiagnosisStoreRoot';
import type { IDiagnosis } from '~/repository/modules/Prescription/DiagnosisModule/type';

const diagnosisStoreRoot = useDiagnosisStoreRoot();

const { isGroupMode, currentGroup, diagnosesSearchList, diagnoses } = storeToRefs(diagnosisStoreRoot);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();

const props = withDefaults(
    defineProps<{
        diagnosis?: IDiagnosis;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        diagnosis: () => ({}) as IDiagnosis,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

const note = computed({
    get: () => props.diagnosis.note,
    set: (value) => diagnosisStoreRoot.updateDiagnosis(props.index!, 'note', value),
});

function deleteItem() {
    diagnosisStoreRoot.deleteDiagnosis(props.index!);
}

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

const loading = ref(false);
const isFirstTime = ref(true);

async function search(q: string) {
    loading.value = true;

    if (isFirstTime.value) {
        isFirstTime.value = false;
    } else {
        await diagnosisStoreRoot.searchDiagnosis(q);
    }
    loading.value = false;
}

const query = computed({
    get: () => props.diagnosis.name,
    set: (value) => {
        diagnosisStoreRoot.updateDiagnosis(props.index!, 'name', value);
        ckeckDuplicateDiagnosis(value);
    },
});

function ckeckDuplicateDiagnosis(value: string) {
    if (value.trim()) {
        if (diagnoses.value.filter((singleDiagnosis) => singleDiagnosis.name.trim() === value.trim()).length !== 1) {
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

const diagnosisInputRef = ref<HTMLDivElement | null>(null);

const focusOnParentElementsLastInputElement = () => {
    focusToParentElementsLastChildsFirstInput(diagnosisInputRef, `.${inputClassToFocus}`);
};

async function onInputFocusHandlerDropDownShow(event: Event) {
    event?.target?.parentNode?.getElementsByTagName('button')[0].click();
    await diagnosisStoreRoot.searchDiagnosis('');
}

function customFetchFunction(query: string) {
    loading.value = true;
    const diagnosis = diagnosisStoreRoot.searchDiagnosis(query);
    loading.value = false;
    console.log(diagnosis);

    return diagnosis;
}
async function handleSelect() {
    await nextTick(); // Ensure the DOM is updated

    if (!ckeckDuplicateDiagnosis(props.diagnosis.name)) focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="diagnosisInputRef"
        class="flex w-full items-center justify-between gap-1"
    >
        <LibIconHamBurger />
        <div class="relative w-[40%]">
            <!-- <UInputMenu
                v-model="query"
                v-model:query="query"
                :options="diagnosesSearchList"
                :loading="loading"
                :debounce="500"
                trailing
                placeholder="Write diagnosis here..."
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
            /> -->

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

        <div class="flex flex-grow">
            <textarea
                v-model="note"
                placeholder="Note"
                rows="1"
                class="w-full resize-none rounded border-none px-2 py-3"
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
        ></div>
    </div>
</template>
