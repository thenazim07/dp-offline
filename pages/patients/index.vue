<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { FunnelIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';
import { useDoctorDiseasesStore } from '~/stores/doctor/diseases';
import { useDoctorPatientStore } from '~/stores/doctor/patient';

definePageMeta({
    middleware: ['auth'],
});

const { featchDiseases } = useDoctorDiseasesStore();
const { featchPatientList } = useDoctorPatientStore();

const isOpen = ref(false);
const isQuerySearch = ref(false);

const patientFilterQuery: Ref<any> = ref({
    per_page: 8,
    own_patient: 1,
    disease_ids: [],
    ...useRoute().query,
});

const { data: diseases } = await useLazyAsyncData('diseases', () => featchDiseases());

const url = computed(() => {
    const queryString = new URLSearchParams(patientFilterQuery.value).toString();
    const regex = /&disease_ids\[\]=(?![0-9,])/g;

    const cleanedQueryString = queryString.replace(/disease_ids=/g, 'disease_ids[]=').replace(regex, '');

    return `per_page=8&own_patient=1&${cleanedQueryString}`;
});

const {
    data: patientList,
    pending,
    execute,
} = await useLazyAsyncData('patient-list', () => featchPatientList(url.value));

watch(
    patientFilterQuery,
    async () => {
        if (isQuerySearch.value) {
            await useRouter().push({ query: patientFilterQuery.value });
            execute();
        }
    },
    {
        deep: true,
        immediate: true,
    },
);

const filterId = (id: number | string) => {
    if (patientFilterQuery.value.disease_ids.includes(id)) {
        patientFilterQuery.value.disease_ids.pop(id);
        return;
    }
    patientFilterQuery.value.disease_ids.push(id);
};

const isSuccess = () => {
    isOpen.value = false;
    execute();
};

onMounted(() => {
    setTimeout(() => {
        isQuerySearch.value = true;
    }, 2000);
});
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#navbar">
                <div class="xl:pr-8">
                    <div class="mr-0 grid w-full max-w-7xl grid-cols-12 items-center gap-5 sm:pr-8 2xl:max-w-[92rem]">
                        <div class="col-span-9 2xl:col-span-9">
                            <div class="flex-1">
                                <label
                                    for="search"
                                    class="sr-only"
                                >
                                    Search Patient by phone/name or patient id
                                </label>
                                <PrescriptionSearchPatient />
                            </div>
                        </div>

                        <div class="col-span-3 mt-1 bg-white 2xl:col-span-3">
                            <div class="flex w-full">
                                <!--filter section-->
                                <Popover
                                    as="div"
                                    class="relative inline-block text-left"
                                >
                                    <PopoverButton
                                        class="mr-6 rounded-lg border p-3 hover:border-blue-500 hover:bg-slate-50 focus:outline-none 2xl:mr-12"
                                    >
                                        <FunnelIcon class="w-4.5 h-5 text-slate-500"></FunnelIcon>
                                    </PopoverButton>

                                    <transition
                                        enter-active-class="transition duration-100 ease-out"
                                        enter-from-class="transform scale-95 opacity-0"
                                        enter-to-class="transform scale-100 opacity-100"
                                        leave-active-class="transition duration-75 ease-in"
                                        leave-from-class="transform scale-100 opacity-100"
                                        leave-to-class="transform scale-95 opacity-0"
                                    >
                                        <PopoverPanel
                                            class="absolute right-12 mb-2 mr-1 mt-2 max-h-72 w-56 origin-top-right overflow-y-auto rounded-lg bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md focus:outline-none"
                                        >
                                            <fieldset>
                                                <div class="space-y-3">
                                                    <div
                                                        v-for="item in diseases"
                                                        :key="item.name"
                                                        class="flex items-center"
                                                    >
                                                        <LibFormCheckbox
                                                            :id="item.name"
                                                            :model-value="item.id"
                                                            class="h-5 w-5 cursor-pointer"
                                                            @update:checked="filterId(item.id)"
                                                        ></LibFormCheckbox>

                                                        <label
                                                            :for="item.name"
                                                            class="font-poppins-regular ml-3 text-sm text-gray-600"
                                                        >
                                                            {{ item.name }}
                                                        </label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </PopoverPanel>
                                    </transition>
                                </Popover>

                                <button
                                    class="py- tracking-wides font-poppins-semibold inline-flex w-full items-center justify-center rounded-md border border-transparent bg-skin-button-accent px-4 text-center text-xs font-semibold text-white transition hover:bg-skin-button-accent-hover focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25 2xl:text-base"
                                    @click="isOpen = true"
                                >
                                    <PlusCircleIcon class="mr-2 h-6 w-6 text-white"></PlusCircleIcon>
                                    New Patient
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Teleport>
        </ClientOnly>

        <div class="mr-0 max-w-7xl xl:pr-8 2xl:max-w-[92rem]">
            <table class="min-w-full">
                <thead class="bg-slate-50">
                    <tr
                        v-if="!pending"
                        class="bg-white py-8 shadow"
                    >
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 pl-4 text-left text-sm font-normal text-slate-500 sm:pl-6"
                        >
                            Patient
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Last Visited
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Age
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Gender
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Weight
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Patient ID
                        </th>
                        <th></th>
                    </tr>
                    <tr></tr>
                </thead>

                <PatientTableRowLoading v-if="pending"></PatientTableRowLoading>

                <PatientTableScopedSlotList
                    v-else
                    :items="patientList"
                >
                    <template #default="{ item }">
                        <PatientTableRowItem :item="item">
                            <template #default="{ id }">
                                <NuxtLink :to="`/patients/details/${id}`">
                                    <ChevronRightIcon class="h-4 w-4 text-slate-300" />
                                </NuxtLink>
                            </template>
                        </PatientTableRowItem>
                    </template>
                </PatientTableScopedSlotList>
            </table>
        </div>

        <!--modal section-->
        <UModal
            v-model="isOpen"
            :ui="{ width: 'w-full h-auto sm:max-w-2xl' }"
            prevent-close
        >
            <div class="flex items-start justify-between pl-6">
                <h3 class="font-poppins-regular my-6 text-xl font-normal text-slate-800 2xl:text-2xl">
                    Add New Patient
                </h3>
                <div class="pr-1 pt-1.5">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-1"
                        @click="isOpen = false"
                    />
                </div>
            </div>

            <div class="px-6">
                <PatientRegisterForm
                    :init="false"
                    @success="isSuccess"
                />
            </div>
        </UModal>
    </div>
</template>

<style scoped>
table {
    border-collapse: separate;
    border-spacing: 0 5px;
}
</style>
