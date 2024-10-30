<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { TrashIcon } from '@heroicons/vue/24/outline';
import type { IInvestigation } from '~/repository/modules/EHR/InvestigationsHistory/types';
import { useEhrInvestigationStoreRoot } from '~/stores/ehr/useInvestigationStoreRoot';
import { useEhrInvestigationHistoryStore } from '~/stores/ehr/investigations';

const ehrInvestigationStoreRoot = useEhrInvestigationStoreRoot();
const { investigationList: investigationListStore } = storeToRefs(ehrInvestigationStoreRoot);
const investicationInputRef = ref<HTMLDivElement | null>(null);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();
const toast = useToast();

const props = withDefaults(
    defineProps<{
        investigation?: IInvestigation;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        investigation: () => ({}) as IInvestigation,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

const note = computed({
    get: () => props.investigation.note,
    set: (value) => ehrInvestigationStoreRoot.updateInvestigation(props.index!, 'note', value),
});

const name = computed({
    get: () => props.investigation.name,
    set: (value) => {
        if (!checkDuplicateInvestigation(value.name)) {
            toast.add({ title: 'investigation already exist', color: 'red' });
            return;
        }

        ehrInvestigationStoreRoot.updateInvestigation(props.index!, 'name', value.name);
        ehrInvestigationStoreRoot.updateInvestigation(props.index!, 'ref', value.ref);

        focusOnParentElementsLastInputElement();
    },
});

function checkDuplicateInvestigation(value: string) {
    if (!value.trim()) return false;

    if (
        investigationListStore.value.filter((singleInvestigation) => singleInvestigation.name.trim() === value.trim())
            .length !== 1
    ) {
        return true;
    } else {
        return false;
    }
}

const value = computed({
    get: () => props.investigation.value,
    set: (value) => ehrInvestigationStoreRoot.updateInvestigation(props.index!, 'value', value),
});

const reportingDate = computed({
    get: () => props.investigation.reporting_date,
    set: (value) =>
        ehrInvestigationStoreRoot.updateInvestigation(
            props.index!,
            'reporting_date',
            value ? useDateFormat(value, 'YYYY-MM-DD') : '',
        ),
});

function deleteItem() {
    ehrInvestigationStoreRoot.deleteInvestigation(props.index!);
}

const configFormStyle = {
    base: inputClassToFocus + ' h-[48px] w-full focus:outline-none focus:border-none font-normal border-none',
    rounded: 'rounded',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 !focus:ring-0 focus:border-none focus:outline-none  shadow-none',
        },
    },
};

const focusOnParentElementsLastInputElement = () => {
    focusToParentElementsLastChildsFirstInput(investicationInputRef, `.${inputClassToFocus}`);
};

const ehrInvestigationStore = useEhrInvestigationHistoryStore();

const { searchInvestigation } = ehrInvestigationStore;

const loading = ref(false);

const investigationList = ref<IInvestigation[]>([]);

async function search(newValue: string) {
    if (name && newValue) {
        loading.value = true;
        const result = await searchInvestigation(newValue);
        investigationList.value = result;
        loading.value = false;
        return result;
    }

    if (name.value === '' && newValue === '') {
        loading.value = true;
        const result = await searchInvestigation('');
        investigationList.value = result;
        loading.value = false;
        return result;
    }
}

async function handleSearchableSelect(selected: any) {
    await nextTick();

    focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="investicationInputRef"
        class="flex w-full items-center justify-between gap-2"
    >
        <LibIconHamBurger />
        <div class="relative w-[80%]">
            <!-- <USelectMenu
                clear-search-on-close
                v-model="name"
                :searchable="search"
                :loading="loading"
                placeholder="Search/Add Investigation"
                option-attribute="name"
                option-value="name"
                trailing
                :ui="configFormStyle"
                :ui-menu="{
                    width: 'w-[40%]',
                }"
                :popper="{
                    strategy: 'fixed',
                    placement: 'bottom-start',
                }"
            >
                <template #label>
                    <span :class="name === '' ? 'text-gray-400' : 'text-gray-900'">
                        {{ name || 'Search/Add Investigation' }}
                    </span>
                </template>
            </USelectMenu> -->

            <VueSelect
                v-model="name"
                :class="`${inputClassToFocus} ${checkDuplicateInvestigation(name) ? 'border border-red-500' : ''}`"
                :options="investigationList"
                :search="search"
                placeholder="Search/Add Investigation"
                label="name"
                @selected="handleSearchableSelect"
            />
        </div>
        <div class="flex h-[48px] w-44 flex-shrink-0 items-center rounded bg-white">
            <VueDatePicker
                v-model="reportingDate"
                :enable-time-picker="false"
                placeholder="Date"
                :max-date="new Date()"
                auto-apply
                :teleport="true"
            >
                <template #dp-input="{ value }">
                    <div class="flex cursor-pointer rounded bg-white">
                        <div
                            v-if="value.length < 2"
                            class="flex w-full items-center divide-x pl-2"
                        >
                            <p class="m-0 flex flex-grow p-0 py-2 text-sm text-slate-600">
                                {{ value.length > 2 ? value : 'Select Date' }}
                            </p>

                            <button class="flex px-2">
                                <LibIconCalender class="h-8 w-8" />
                            </button>
                        </div>
                        <p
                            v-else
                            class="mr-14 flex-grow self-stretch border-r border-gray-500 py-2 pl-2 text-sm text-slate-600"
                        >
                            {{ value }}
                        </p>
                    </div>
                </template>
            </VueDatePicker>
        </div>

        <div>
            <input
                v-model="value"
                placeholder="Ex: 1, mg/ml..."
                rows="1"
                type="text"
                class="h-[48px] w-full resize-none rounded border-none p-3 text-sm font-normal text-slate-900 placeholder:text-slate-400"
                @keyup.enter="focusOnParentElementsLastInputElement"
            />
        </div>

        <div class="flex w-[40%]">
            <textarea
                v-model="note"
                placeholder="Note"
                rows="1"
                class="h-[48px] w-full resize-none rounded border-none p-3 text-sm"
                @keydown.enter.exact.prevent="focusOnParentElementsLastInputElement"
            ></textarea>
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
            class="w-[3.5%]"
        ></div>
    </div>
</template>
