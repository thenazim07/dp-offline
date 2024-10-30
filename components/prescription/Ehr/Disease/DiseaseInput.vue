<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrDiseaseStoreRoot } from '~/stores/ehr/useDiseaseStoreRoot';
import type { IDisease } from '~/repository/modules/EHR/DiseaseHistory/types';

const ehrDiseaseStoreRoot = useEhrDiseaseStoreRoot();
const { loading, search, result } = await useEhrDiseaseSearch();
const diseaseListInputRef = ref<HTMLDivElement | null>(null);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();

const { duration_types_for_past_history_disease } = storeToRefs(useConfigsStore());

const { diseaseList } = storeToRefs(ehrDiseaseStoreRoot);
const toast = useToast();

const props = withDefaults(
    defineProps<{
        disease?: IDisease;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        disease: () => ({}) as IDisease,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

const note = computed({
    get: () => props.disease.note,
    set: (value) => ehrDiseaseStoreRoot.updateIndication(props.index!, 'note', value),
});

const disease = computed({
    get: () => props.disease,
    set: (value) => {
        if (!checkDuplicateDiseases(value?.name)) {
            toast.add({ title: 'diseases already exist', color: 'red' });
            return;
        }
        ehrDiseaseStoreRoot.updateIndication(props.index!, 'disease', value?.name);
        ehrDiseaseStoreRoot.updateIndication(props.index!, 'icd_code_ref', value?.code);
    },
});

function checkDuplicateDiseases(value: string) {
    if (!value.trim()) return false;

    if (diseaseList.value.filter((singleDisease) => singleDisease.disease.trim() === value.trim()).length !== 1) {
        return true;
    } else {
        return false;
    }
}

const duration = computed({
    get: () => props?.disease?.duration?.toString() || '',
    set: (value) =>
        ehrDiseaseStoreRoot.updateIndication(props.index!, 'duration', Number(value) !== 0 ? Number(value) : null),
});

const durationType = computed({
    get: () => props.disease.duration_type,
    set: (value) => ehrDiseaseStoreRoot.updateIndication(props.index!, 'duration_type', value),
});

const durationLocale = computed({
    get: () => props?.disease?.duration_locale || 'en',
    set: (value) => ehrDiseaseStoreRoot.updateIndication(props.index!, 'duration_locale', value),
});

function deleteItem() {
    ehrDiseaseStoreRoot.deleteDisease(props.index!);
}

const configFormStyle = {
    base:
        inputClassToFocus +
        ' h-[48px] w-full focus:outline-none focus:border-none font-normal border-none overflow-hidden',
    rounded: 'rounded',
    ring: 'ring-0',
    color: {
        white: {
            outline: 'ring-0 !focus:ring-0 focus:border-none focus:outline-none  shadow-none',
        },
    },
};

const focusOnParentElementsLastInputElement = () => {
    focusToParentElementsLastChildsFirstInput(diseaseListInputRef, `.${inputClassToFocus}`);
};

async function handleSearchableSelect(selected: any) {
    await nextTick();

    focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="diseaseListInputRef"
        class="flex w-full items-center justify-between gap-2"
    >
        <LibIconHamBurger />
        <div class="relative w-[80%]">
            <!-- <USelectMenu
                v-model="disease"
                clear-search-on-close
                :searchable="search"
                :options="result"
                :loading="loading"
                placeholder="Search/Add Disease"
                option-attribute="disease"
                option-value="disease"
                trailing
                :ui="configFormStyle"
                :ui-menu="{
                    width: 'w-[45%]',
                }"
                :popper="{
                    strategy: 'fixed',
                    placement: 'bottom-start',
                }"
            >
                <template #label>
                    <span :class="disease === '' ? 'text-gray-400' : 'text-gray-900'">
                        {{ disease || 'Search/Add Disease' }}
                    </span>
                </template>
            </USelectMenu> -->
            <VueSelect
                v-model="disease"
                :class="`${inputClassToFocus} ${checkDuplicateDiseases(disease.disease) ? 'border border-red-500' : ''}`"
                :options="result"
                :search="search"
                placeholder="Search/Add Disease"
                label="disease"
                @selected="handleSearchableSelect"
            />
        </div>
        <div>
            <PrescriptionBaseComponentsDurationWithType
                v-model:duration="duration"
                v-model:duration-type="durationType"
                v-model:duration-locale="durationLocale"
                :shown-duration-types="duration_types_for_past_history_disease"
                duration-locale-persist-store-type="past_history_diseases"
                class="flex-1"
                @onInputKeyUpEnterHandler="focusOnParentElementsLastInputElement"
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
            class="w-[4%]"
        ></div>
    </div>
</template>
