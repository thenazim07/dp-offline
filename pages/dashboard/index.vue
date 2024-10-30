<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { useDoctorStore } from '~/stores/doctor';
import { usePrescriptionStore } from '~/stores/prescription/usePrescriptionStore';
const { featchDashboardOverviewFilterData } = useDoctorStore();
const { resetPrescription } = usePrescriptionStore();

definePageMeta({
    middleware: ['auth'],
});

const dateValue = ref([]);
const formatter = ref({
    date: 'YYYY-MM-DD',
    month: 'MM',
});

const { data: overviewData } = await useLazyAsyncData('dashboard', () => featchDashboardOverviewFilterData());

const currentDetails = ref({});

const filterVisit = async () => {
    if (!dateValue.value[0] && !dateValue.value[1]) return;
    const path = `from_date=${dateValue.value[0]}&to_date=${dateValue.value[1]}`;
    const response = await featchDashboardOverviewFilterData(path);

    if (response) {
        currentDetails.value = response;
        dateValue.value = [];
    }
};

watch(
    dateValue,
    () => {
        filterVisit();
    },
    { deep: true, immediate: true },
);
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#navbar">
                <div class="w-full">
                    <label
                        for="search"
                        class="sr-only"
                    >
                        Search Patient by phone/name or patient id</label
                    >
                    <PrescriptionSearchPatient />
                </div>
            </Teleport>
        </ClientOnly>

        <div class="flex w-full">
            <div class="mr-8 w-full max-w-[66rem] 2xl:mr-16">
                <div
                    class="mb-6 w-full rounded-lg bg-white bg-patient-create-card bg-right bg-no-repeat p-6 shadow"
                    style="background-position-x: 98%"
                >
                    <div class="pb-12">
                        <h2 class="font-poppins-bold pb-2 text-2xl text-slate-800 2xl:pb-3 2xl:text-3xl">
                            Are you ready for consultation?
                        </h2>
                        <p class="font-poppins-regular text-base font-normal text-slate-800">
                            Prescribe with Precision, Anytime, Anywhere
                        </p>
                    </div>
                    <div class="pb-6">
                        <NuxtLink
                            to="/dashboard/prescription/create"
                            @click="resetPrescription"
                        >
                            <LibButtonsCreatePatient class-name="text-base">
                                <LibIconRx
                                    color="#ffffff"
                                    class="mr-2 h-6 w-6"
                                ></LibIconRx>
                                Create New Prescription
                            </LibButtonsCreatePatient>
                        </NuxtLink>
                    </div>
                </div>

                <!-- Template Section -->
                <DashboardTemplateSection />
            </div>

            <!--right--side--bar-->
            <div class="w-full max-w-[20rem] bg-white p-6 2xl:max-w-[29rem]">
                <div class="flex items-center justify-between pb-4">
                    <div>
                        <h3 class="font-poppins-bold text-base text-slate-800 2xl:text-xl">Overview</h3>
                    </div>
                    <div>
                        <div class="flex items-center">
                            <p class="font-poppins-regular pb-1 pr-1 text-slate-500">Count by date</p>
                            <ClientOnly>
                                <Popover class="relative">
                                    <PopoverButton>
                                        <LazyLibIconCalender class="h-5 w-5"></LazyLibIconCalender>
                                    </PopoverButton>

                                    <transition
                                        enter-active-class="transition ease-out duration-100"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95"
                                    >
                                        <PopoverPanel
                                            class="absolute right-0 z-10 min-h-[23.6rem] min-w-[43.5rem] shadow-follow-up"
                                        >
                                            <Datepicker
                                                v-model="dateValue"
                                                :shortcuts="false"
                                                no-input
                                                :formatter="formatter"
                                                @click:next="filterVisit()"
                                            />
                                            <div class="absolute inset-x-0 -bottom-12 bg-white px-4 py-6">
                                                <div
                                                    class="grid h-12 w-full grid-cols-2 items-center rounded-md border-t bg-slate-200"
                                                >
                                                    <div>
                                                        <p
                                                            class="font-poppins-regular pl-6 font-semibold text-slate-800"
                                                        >
                                                            Total visits: {{ currentDetails?.custom_range_visit }}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p
                                                            class="font-poppins-regular pl-6 font-semibold text-slate-800"
                                                        >
                                                            New Patients: {{ currentDetails?.custom_range_patients }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </PopoverPanel>
                                    </transition>
                                </Popover>
                            </ClientOnly>
                        </div>
                    </div>
                </div>

                <div class="mb-6 grid grid-cols-2 gap-3">
                    <DashboardCountCardInOverview
                        title="Today's Visit"
                        icon="today_visit_calender.svg"
                        :value="overviewData?.todays_visits"
                    />

                    <DashboardCountCardInOverview
                        title="This Month Visit"
                        icon="this_month_visit.svg"
                        :value="overviewData?.current_month_visits"
                    />

                    <DashboardCountCardInOverview
                        title="Last Month Visited"
                        icon="last_month_visited.svg"
                        :value="overviewData?.last_month_visits"
                    />

                    <DashboardCountCardInOverview
                        title="Total Visited"
                        icon="total_visited.svg"
                        :value="overviewData?.total_visits"
                    />
                </div>

                <div class="rounded-lg border border-slate-200 p-6">
                    <div class="flow-root">
                        <ul
                            role="list"
                            class="-my-5 divide-y divide-gray-200"
                        >
                            <DashboardListInfo
                                title="Today's Patient"
                                :value="overviewData?.todays_patients"
                            ></DashboardListInfo>
                            <DashboardListInfo
                                title="This Month Patient"
                                :value="overviewData?.current_month_patients"
                            ></DashboardListInfo>
                            <DashboardListInfo
                                title="Last Month Patient"
                                :value="overviewData?.last_month_patients"
                            ></DashboardListInfo>
                            <DashboardListInfo
                                title="Total Patient"
                                :value="overviewData?.total_patients"
                            ></DashboardListInfo>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
