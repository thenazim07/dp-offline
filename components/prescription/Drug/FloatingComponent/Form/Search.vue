<script lang="ts" setup>
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    TransitionRoot,
} from '@headlessui/vue';
import { MagnifyingGlassIcon, PlusIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { usePrescriptionDrugStore } from '~/stores/prescription/useDrugStore';
const prescriptionDrugStore = usePrescriptionDrugStore();
const { selectedListIndexToFocus, isEnterClickedOnDurationInput, drugs } = storeToRefs(prescriptionDrugStore);
const query = ref('');
const emit = defineEmits(['createOrSelect']);

const toast = useToast();

const onSelected = (drug: any) => {
    if (drugs.value.find((_drug) => generateDrugUniqName(_drug) === generateDrugUniqName(drug))) {
        toast.add({ title: 'Drug already exist', color: 'red' });
        return;
    }

    query.value = '';
    prescriptionDrugStore.addMoreDrug(drug);
};

const loading = ref(false);
const list = ref([]);

const search = useDebounceFn(async (searchQuery: string) => {
    query.value = searchQuery;
    // if (searchQuery.trim().length === 0) {
    //     list.value = [];
    //     return true;
    // }
    loading.value = true;
    const result = await prescriptionDrugStore.searchDrug(searchQuery);
    loading.value = false;
    list.value = result;
}, 300);

const customItem = () => {
    prescriptionDrugStore.addMoreDrug({ brand_name: query.value, is_custom_drug: true });
    list.value = [];
    query.value = '';
};

const buttonRef = ref<HTMLButtonElement>();

const setFocus = () => {
    nextTick(async () => {
        const inputElement = document.querySelector('.medicine-search .vs__search');
        if (inputElement) {
            inputElement.focus();
            //await search('');

            //inputElement?.parentElement?.getElementsByTagName('button')[0].click();
            // buttonRef.value = inputElement?.parentElement?.getElementsByTagName('button')[0];
        }
    });
};

onMounted(() => {
    if (selectedListIndexToFocus.value == null) setFocus();
});

watch(
    () => isEnterClickedOnDurationInput.value,
    (currentIsEnterClickedOnDurationInput) => {
        if (currentIsEnterClickedOnDurationInput) {
            setFocus();
            isEnterClickedOnDurationInput.value = false;
        }
    },
);

function handleSearchableSelect() {
    list.value = [];
}
</script>

<template>
    <div>
        <!-- <Combobox
            :model-value="query"
            @update:model-value="(value: any) => onSelecte(value)"
        >
            <div class="relative mt-1">
                <div class="relative w-full cursor-default overflow-hidden">
                    <ComboboxInput
                        id="searchInput"
                        placeholder="Search / Add Medicine"
                        class="font-poppins-regular block h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                        autofocus
                        autocomplete="off"
                        @change="search($event.target.value)"
                    />

                    <ComboboxButton
                        v-if="!loading"
                        class="absolute inset-y-0 left-3 flex items-center"
                    >
                        <MagnifyingGlassIcon
                            class="h-5 w-5 text-slate-500"
                            aria-hidden="true"
                        />
                    </ComboboxButton>

                    <ComboboxButton
                        v-else
                        class="absolute inset-y-0 left-3 flex items-center"
                    >
                        <ArrowPathIcon class="h-4 w-4 animate-spin text-slate-500" />
                    </ComboboxButton>

                    <ComboboxButton
                        v-if="query.length > 1 && !loading"
                        class="absolute inset-y-0 right-3 flex items-center"
                    >
                        <button
                            class="flex h-6 w-6 items-center justify-center rounded-full bg-skin-button-accent text-center ring ring-transparent hover:ring-blue-200"
                            @click.prevent="customItem"
                        >
                            <PlusIcon class="h-4 w-5 text-white"></PlusIcon>
                        </button>
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    class="absolute inset-x-0 z-30 mr-1 max-h-72 w-full rounded-b-lg bg-white shadow-xl scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
                    :class="list.length > 0 ? 'overflow-y-auto py-3' : 'overflow-hidden py-0'"
                >
                    <div
                        v-if="query.length > 1 && list.length === 0 && !loading"
                        class="h-full py-8"
                    >
                        <div class="mb-6 flex items-center justify-center">
                            <img
                                class="h-20 w-20"
                                src="/images/no-results.svg"
                            />
                        </div>
                        <div class="mb-6 text-center">
                            <h5 class="mb-1 text-2xl font-bold text-slate-900">No Medicine Found</h5>
                            <p class="text-base text-slate-500">Click the below button to create a new medicine</p>
                        </div>
                        <div class="text-center">
                            <UButton
                                icon="i-heroicons-plus"
                                color="blue"
                                size="lg"
                                class="px-5 py-3"
                                @click.prevent="customItem"
                            >
                                Create New Medicine
                            </UButton>
                        </div>
                    </div>

                    <TransitionRoot
                        v-if="list.length > 0"
                        leave="transition ease-in duration-100"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                        @after-leave="query = ''"
                    >
                        <ComboboxOption
                            v-for="(drug, index) in list"
                            :key="index"
                            v-slot="{ active }"
                            as="template"
                            :value="drug"
                        >
                            <li
                                :class="{
                                    'bg-slate-50 text-slate-900': active,
                                    'text-gray-700': !active,
                                }"
                                class="font-poppins-regular flex cursor-pointer items-center border-b border-slate-100 px-3.5 py-3 text-sm font-normal text-slate-900 hover:bg-slate-50 2xl:py-2"
                            >
                                <div class="mr-1">
                                    <PrescriptionMedicineLeftSideComponentDrugIconWithName
                                        class-name="text-slate-900 font-medium text-sm "
                                        :icon="drug?.dosage_form ? drug?.dosage_form?.icon_url : drug?.icon_url"
                                        :name="drug?.brand_name ? drug?.brand_name : drug?.name"
                                        :strength="drug?.strength"
                                    />
                                </div>
                                <div>
                                    <p class="font-meduim font-poppins-regular text-sm text-[#136AFB80]">
                                        {{ drug?.generic?.name }}
                                    </p>
                                </div>
                            </li>
                        </ComboboxOption>
                    </TransitionRoot>
                </ComboboxOptions>
            </div>
        </Combobox> -->

        <VueSelect
            :model-value="query"
            @update:model-value="(value: any) => onSelected(value)"
            class="medicine-search"
            :options="list"
            :search="search"
            placeholder="Search Medicine"
            label="name"
            :append-to-body="false"
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

            <template #noOption="{ search, searching }">
                <div
                    class="h-full py-8"
                    v-if="searching"
                >
                    <div class="mb-6 flex items-center justify-center">
                        <img
                            class="h-20 w-20"
                            src="/images/no-results.svg"
                        />
                    </div>
                    <div class="mb-6 text-center">
                        <h5 class="mb-1 text-2xl font-bold text-slate-900">No Medicine Found for {{ search }}</h5>
                        <p class="text-base text-slate-500">Click the below button to create a new medicine</p>
                    </div>
                    <div class="text-center">
                        <UButton
                            icon="i-heroicons-plus"
                            color="blue"
                            size="lg"
                            class="px-5 py-3"
                            @click.prevent="customItem"
                        >
                            Create New Medicine
                        </UButton>
                    </div>
                </div>
            </template>
        </VueSelect>
    </div>
</template>
