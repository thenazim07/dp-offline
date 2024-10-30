<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import type { IAdvice } from '~/repository/modules/Prescription/AdviceModule/type';
import { useAdviceStoreRoot } from '~/stores/prescription/useAdviceStoreRoot';

const adviceStoreRoot = useAdviceStoreRoot();
const { isGroupMode, currentGroup, adviceSearchList, advices } = storeToRefs(adviceStoreRoot);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();

const loading = ref(false);
const isFirstTime = ref(true);
async function search(q: string) {
    loading.value = true;

    let advices = [];
    if (isFirstTime.value) {
        isFirstTime.value = false;
    } else {
        advices = await adviceStoreRoot.searchAdvice(q);
    }
    loading.value = false;

    return advices;
}

const props = withDefaults(
    defineProps<{
        advice?: IAdvice;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        advice: () => ({}) as IAdvice,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

function deleteItem() {
    adviceStoreRoot.deleteAdvice(props.index!);
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
    get: () => props.advice.name,
    set: (value) => {
        adviceStoreRoot.updateAdvice(props.index!, 'name', value);

        ckeckDuplicateAdvices(value);
    },
});

function ckeckDuplicateAdvices(value: string) {
    if (value.trim()) {
        if (advices.value.filter((singleAdvices) => singleAdvices.name.trim() === value.trim()).length !== 1) {
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

const adviceInputRef = ref<HTMLDivElement | null>(null);

const focusOnParentElementsLastInputElement = () => {
    focusToParentElementsLastChildsFirstInput(adviceInputRef, `.${inputClassToFocus}`);
};

async function onInputFocusHandlerDropDownShow(event: Event) {
    event?.target?.parentNode?.getElementsByTagName('button')[0].click();
    await adviceStoreRoot.searchAdvice('');
}

async function customFetchFunction(query: string) {
    loading.value = true;
    const advices = await adviceStoreRoot.searchAdvice(query);
    loading.value = false;

    return advices;
}

async function handleSelect() {
    await nextTick(); // Ensure the DOM is updated

    if (!ckeckDuplicateAdvices(props.advice.name)) focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="adviceInputRef"
        class="flex w-full items-center justify-between gap-1"
    >
        <LibIconHamBurger />
        <div class="relative w-[97%]">
            <!-- <UInputMenu
                v-model="query"
                v-model:query="query"
                :options="adviceSearchList"
                :loading="loading"
                :debounce="500"
                trailing
                placeholder="Write your advice here..."
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
