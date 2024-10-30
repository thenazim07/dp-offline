<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import type { IObservation } from '~/stores/prescription/useOnExaminationStoreRoot';
import { useOnExaminationStoreRoot } from '~/stores/prescription/useOnExaminationStoreRoot';

const onExaminationStoreRoot = useOnExaminationStoreRoot();
const { isGroupMode, currentGroup, observationSearchList, observations } = storeToRefs(onExaminationStoreRoot);
const observationInputRef = ref<HTMLDivElement | null>(null);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();

const loading = ref(false);
const isFirstTime = ref(true);
async function search(q: string) {
    loading.value = true;

    if (isFirstTime.value) {
        isFirstTime.value = false;
    } else {
        await onExaminationStoreRoot.searchObservation(q);
    }
    loading.value = false;
}

const props = withDefaults(
    defineProps<{
        observation?: IObservation;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        observation: () => ({}) as IObservation,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

function deleteItem() {
    onExaminationStoreRoot.deleteObservation(props.index!);
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

const query = computed({
    get: () => props.observation.name,
    set: (value) => {
        onExaminationStoreRoot.updateObservation(props.index!, 'name', value);

        ckeckDuplicateObservations(value);
    },
});

function ckeckDuplicateObservations(value: string) {
    if (value.trim()) {
        if (
            observations.value.filter((singleObservations) => singleObservations.name.trim() === value.trim())
                .length !== 1
        ) {
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
    focusToParentElementsLastChildsFirstInput(observationInputRef, `.${inputClassToFocus}`);
};

async function onInputFocusHandlerDropDownShow(event: Event) {
    event?.target?.parentNode?.getElementsByTagName('button')[0].click();
    await onExaminationStoreRoot.searchObservation('');
}

async function customFetchFunction(query: string) {
    loading.value = true;
    const obsevations = await onExaminationStoreRoot.searchObservation(query);
    loading.value = false;

    return obsevations;
}

async function handleSelect() {
    await nextTick(); // Ensure the DOM is updated

    if (!ckeckDuplicateObservations(props.observation.name)) focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="observationInputRef"
        class="flex w-full items-center justify-between gap-1"
    >
        <LibIconHamBurger />
        <div class="relative w-[97%]">
            <!-- <UInputMenu
                v-model="query"
                v-model:query="query"
                :options="observationSearchList"
                :loading="loading"
                :debounce="500"
                trailing
                placeholder="Write your observation here..."
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
                @click.prevent="deleteItem()"
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
