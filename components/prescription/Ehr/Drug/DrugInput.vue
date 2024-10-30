<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import type { IPastDrug } from '~/repository/modules/EHR/PastDrugHistory/types';
import { useEhrDrugStoreRoot } from '~/stores/ehr/useDrugStoreRoot';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
import { usePrescriptionDrugFrequenciesStore } from '~/stores/prescription/useDrugStore/frequencies';

const ehrDrugStoreRoot = useEhrDrugStoreRoot();
const { drugList } = storeToRefs(ehrDrugStoreRoot);
const drugInputRef = ref<HTMLDivElement | null>(null);
const { focusToParentElementsLastChildsFirstInput, inputClassToFocus } = useFocusOnParentElementsLastInputElement();
const loading = ref(false);
const toast = useToast();

const { duration_types_for_past_history_medication } = storeToRefs(useConfigsStore());
const prescriptionDrugStore = usePrescriptionDrugStore();

const { searchDrug } = prescriptionDrugStore;
const prescriptionDrugFrequenciesStore = usePrescriptionDrugFrequenciesStore();
const { frequenciesList } = storeToRefs(prescriptionDrugFrequenciesStore);
const instructionsValueList = computed(
    () =>
        frequenciesList.value?.map((instruction) => {
            return {
                ...instruction,
                name: instruction.value,
            };
        }) ?? [],
);

const props = withDefaults(
    defineProps<{
        drug?: IPastDrug;
        index?: number;
        autofocus?: boolean;
        isRemovable?: boolean;
    }>(),
    {
        drug: () => ({}) as IPastDrug,
        index: undefined,
        autofocus: false,
        isRemovable: true,
    },
);

const drug = computed({
    get: () => props.drug.name,
    set: (value) => {
        if (!checkDuplicateDrug(value.ref)) {
            toast.add({ title: 'drug already exist', color: 'red' });
            return;
        }

        ehrDrugStoreRoot.updateDrug(props.index!, 'name', generateDrugUniqName(value, true));
        ehrDrugStoreRoot.updateDrug(props.index!, 'ref', value.ref);
        ehrDrugStoreRoot.updateDrug(props.index!, 'type', value.type);
        ehrDrugStoreRoot.updateDrug(props.index!, 'drug_ref', value.ref);

        focusOnParentElementsLastInputElement();
    },
});

function checkDuplicateDrug(value: string) {
    if (value.trim() === 'UniqueRef') return false;

    if (drugList.value.filter((singleDrug) => singleDrug.drug_ref?.trim() === value.trim()).length !== 1) {
        return true;
    } else {
        return false;
    }
}

const frequency = computed({
    get: () => props.drug.frequency || '',
    set: (value) => ehrDrugStoreRoot.updateDrug(props.index!, 'frequency', value),
});

const duration = computed({
    get: () => props?.drug?.duration?.toString() || '',
    set: (value) => ehrDrugStoreRoot.updateDrug(props.index!, 'duration', Number(value) !== 0 ? Number(value) : null),
});

const durationType = computed({
    get: () => props.drug.duration_type,
    set: (value) => ehrDrugStoreRoot.updateDrug(props.index!, 'duration_type', value),
});

const durationLocale = computed({
    get: () => props.drug?.duration_locale || 'en',
    set: (value) => ehrDrugStoreRoot.updateDrug(props.index!, 'duration_locale', value),
});

function deleteItem() {
    ehrDrugStoreRoot.deleteDrug(props.index!);
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
    focusToParentElementsLastChildsFirstInput(drugInputRef, `.${inputClassToFocus}`);
};

const drugResults = ref([]);

async function search(newValue: string) {
    // searchQuery.value = newValue;
    // if (newValue === '') return [];
    if (drug && newValue) {
        loading.value = true;
        const result = await searchDrug(newValue);
        drugResults.value = result;
        loading.value = false;
        return result;
    }

    if (drug.value === '' && newValue === '') {
        loading.value = true;
        const result = await searchDrug('', 'past_drug_history');
        drugResults.value = result;
        loading.value = false;
        return result;
    }
}

function handleSelectFrequency(selectedItem: any) {
    ehrDrugStoreRoot.updateDrug(props.index!, 'frequency', selectedItem.name);
}

async function handleSearchableSelect(selected: any) {
    await nextTick();

    focusOnParentElementsLastInputElement();
}
</script>

<template>
    <div
        ref="drugInputRef"
        class="flex w-full items-center justify-between gap-2"
    >
        <LibIconHamBurger />
        <div class="relative w-[80%]">
            <!-- <USelectMenu
                clear-search-on-close
                v-model="drug"
                :searchable="search"
                :loading="loading"
                placeholder="Search/Add Medicine"
                trailing
                :ui="configFormStyle"
                :ui-menu="{
                    base: 'divide-y divide-slate-200',
                    width: 'w-[51%]',
                    empty: 'divide-none divide-transparent',
                    option: {
                        base: '',
                        rounded: 'rounded-none',
                    },
                }"
                :popper="{
                    strategy: 'fixed',
                    placement: 'bottom-start',
                }"
            >
                <template #label>
                    <span :class="drug === '' ? 'text-gray-400' : 'text-gray-900'">
                        {{ drug || 'Search/Add Medicine' }}
                    </span>
                </template>

                <template #option="{ option: drug }">
                    <div
                        class="flex w-full cursor-pointer items-center py-3 text-sm font-normal text-slate-900 2xl:py-2"
                    >
                        <div class="mr-1">
                            <PrescriptionMedicineLeftSideComponentDrugIconWithName
                                class-name="text-slate-900 font-medium text-sm"
                                :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                                :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                                :strength="drug?.strength"
                            />
                        </div>
                        <div>
                            <p class="font-meduim text-sm text-[#136AFB80]">
                                {{ drug?.generic?.name }}
                            </p>
                        </div>
                    </div>
                </template>
            </USelectMenu> -->

            <VueSelect
                v-model="drug"
                :class="`${inputClassToFocus} ${checkDuplicateDrug(props.drug?.drug_ref) ? 'border border-red-500' : ''}`"
                :options="drugResults"
                :search="search"
                placeholder="Search Medicine"
                label="name"
                @selected="handleSearchableSelect"
            >
                <template #option="{ drug }">
                    <div
                        class="flex w-full cursor-pointer items-center overflow-hidden py-3 text-sm font-normal text-slate-900 2xl:py-2"
                    >
                        <div class="mr-1">
                            <PrescriptionMedicineLeftSideComponentDrugIconWithName
                                class-name="text-slate-900 font-medium text-sm"
                                :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                                :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                                :strength="drug?.strength"
                            />
                        </div>
                        <div>
                            <p class="font-meduim text-sm text-[#136AFB80]">
                                {{ drug?.generic?.name }}
                            </p>
                        </div>
                    </div>
                </template>
            </VueSelect>
        </div>

        <div>
            <!-- <PrescriptionDrugFloatingComponentFormFrequency
                v-model="frequency"
                v-model:query="frequency"
                @select-item="ehrDrugStoreRoot.updateDrug(props.index!, 'frequency', $event.name)"
                @onInputKeyUpEnterHandler="focusOnParentElementsLastInputElement"
            /> -->

            <AutoComplete
                v-model="frequency"
                :initial-suggestions="instructionsValueList"
                :fetch-suggestions="search"
                :autofocus="false"
                rootClass=""
                inputParentClass=""
                inputClass=""
                ulClass=""
                liClass=""
                placeholder="Ex. 1+0+1"
                :initial-api-call="false"
                :use-search-api="false"
                @select="handleSelectFrequency"
                @on-enter="focusOnParentElementsLastInputElement"
            />
        </div>

        <div>
            <PrescriptionBaseComponentsDurationWithType
                v-model:duration="duration"
                v-model:duration-type="durationType"
                v-model:duration-locale="durationLocale"
                :shown-duration-types="duration_types_for_past_history_medication"
                duration-locale-persist-store-type="past_history_medication"
                class="flex-1"
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
            class="w-[4%]"
        ></div>
    </div>
</template>
