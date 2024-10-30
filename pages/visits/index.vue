<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { FunnelIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
import { useDoctorVisitsStore } from '~/stores/doctor/visits';
const { fetchVisitsList } = useDoctorVisitsStore();
definePageMeta({
    middleware: ['auth'],
});

const filtersForGender = reactive([
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
]);

const filtersForVisitType = reactive([
    { value: 'regular', label: 'Regular' },
    { value: 'follow_up', label: 'Follow up' },
]);

const fatchPatientByFilter = () => {
    // const query = { ...route.query };
    // if (query['gender[]']) {
    //     Array.isArray(route.query['options[]']) ? route.query['options[]'] : [route.query['options[]']];
    //     query['gender[]'] = values.value;
    // }
    // if (query['type[]']) {
    // }
    // router.push({ query });
};

const { data: visits, pending } = await useLazyAsyncData('visits', () => fetchVisitsList(0));

const visitsList = computed(() => {
    if (visits?.value) {
        return visits?.value.map((visit: any) => {
            return { ...visit, class: 'bg-white' };
        });
    }
    return [];
});
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#navbar">
                <div class="pt-4 xl:pr-8">
                    <div class="mr-0 grid w-full max-w-7xl grid-cols-12 items-center gap-5 sm:pr-8 2xl:max-w-[92rem]">
                        <div class="col-span-9 2xl:col-span-9"></div>

                        <div class="col-span-3 bg-white 2xl:col-span-3">
                            <div class="flex w-full">
                                <!--filter section-->
                                <Popover
                                    v-if="false"
                                    as="div"
                                    class="relative inline-block text-left"
                                >
                                    <PopoverButton
                                        class="mr-6 rounded-lg border p-3.5 hover:border-blue-500 hover:bg-slate-50 focus:outline-none 2xl:mr-12"
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
                                            class="absolute right-5 mb-2 mr-1 mt-2 h-auto w-56 origin-top-right overflow-y-auto rounded-lg bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md focus:outline-none"
                                        >
                                            <fieldset>
                                                <p class="font-poppins-regular pb-1.5 text-base font-semibold">
                                                    Gender
                                                </p>
                                                <div class="space-y-3">
                                                    <div
                                                        v-for="item in filtersForGender"
                                                        :key="item.value"
                                                        class="flex items-center"
                                                    >
                                                        <LibFormCheckbox
                                                            :id="item.label + '_' + item.value"
                                                            :value="item.value"
                                                            class="h-5 w-5 cursor-pointer"
                                                            @update:checked="fatchPatientByFilter(item, $event)"
                                                        ></LibFormCheckbox>
                                                        <label
                                                            :for="item.label + '_' + item.value"
                                                            class="ml-3 text-sm text-gray-600"
                                                        >
                                                            {{ item.label }}
                                                        </label>
                                                    </div>
                                                </div>

                                                <div class="pb-2 pt-3">
                                                    <hr />
                                                </div>

                                                <p class="font-poppins-regular pb-1.5 text-base font-semibold">
                                                    Visit Type
                                                </p>
                                                <div class="space-y-3">
                                                    <div
                                                        v-for="item in filtersForVisitType"
                                                        :key="item.value"
                                                        class="flex items-center"
                                                    >
                                                        <LibFormCheckbox
                                                            :id="item.label + '_' + item.value"
                                                            :value="item.value"
                                                            class="h-5 w-5 cursor-pointer"
                                                            @update:checked="fatchPatientByFilter(item, $event)"
                                                        ></LibFormCheckbox>
                                                        <label
                                                            :for="item.label + '_' + item.value"
                                                            class="ml-3 text-sm text-gray-600"
                                                        >
                                                            {{ item.label }}
                                                        </label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </PopoverPanel>
                                    </transition>
                                </Popover>

                                <NuxtLink
                                    to="/dashboard/prescription/create"
                                    class="tracking-wides font-poppins-semibold inline-flex w-full items-center justify-center rounded-md border border-transparent bg-skin-button-accent px-4 py-[.68rem] text-center text-xs font-semibold text-white transition hover:bg-skin-button-accent-hover focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25 2xl:text-base"
                                >
                                    <PlusCircleIcon class="mr-2 h-6 w-6 text-white"></PlusCircleIcon>
                                    New Visit
                                </NuxtLink>
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
                            Date
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Patient
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Chief Complaints
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Diagnosis
                        </th>
                        <th
                            scope="col"
                            class="font-poppins-regular py-5 text-left text-sm font-normal text-slate-500"
                        >
                            Investigation
                        </th>
                        <th
                            scope="col"
                            class="text-crenter font-poppins-regular py-5 pr-6 text-sm font-normal text-slate-500"
                        >
                            Prescription
                        </th>
                    </tr>
                    <tr></tr>
                </thead>

                <NuxtErrorBoundary>
                    <PatientTableRowLoading v-if="pending"></PatientTableRowLoading>

                    <VisitTableScopedSlotList
                        v-else
                        :items="visitsList"
                    >
                        <template #default="{ item }">
                            <VisitTableRowItem :item="item" />
                        </template>
                    </VisitTableScopedSlotList>

                    <template #error="{ error }">
                        <p>An error occurred: {{ error }}</p>
                    </template>
                </NuxtErrorBoundary>
            </table>
        </div>
    </div>
</template>

<style scoped>
table {
    border-collapse: separate !important;
    border-spacing: 0 5px !important;
}
</style>
