<script setup>
import { PencilSquareIcon } from '@heroicons/vue/24/solid';

import { ref } from 'vue';
const activeTabName = ref('visit');

const activeTab = (value) => {
    activeTabName.value = value;
};
</script>

<template>
    <DashboardLayout>
        <template #main>
            <div class="grid grid-cols-12 gap-8 pr-8">
                <div class="relative col-span-8 mb-6 w-full rounded-lg bg-white shadow">
                    <PatientTab @isActiveTap="activeTab($event)"></PatientTab>

                    <div
                        class="height mb-2 mr-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
                    >
                        <section v-if="activeTabName === 'visit'">
                            <div class="timeline-items">
                                <PatientFollowUpCard
                                    v-for="x in 3"
                                    :key="x"
                                ></PatientFollowUpCard>
                            </div>
                        </section>

                        <section v-else>
                            <PatientHistory></PatientHistory>
                        </section>
                    </div>
                </div>

                <div class="col-span-4">
                    <div class="mb-6 w-full rounded-lg bg-white p-5 shadow">
                        <p class="font-poppins-regular text-sm text-slate-500">Patient Information</p>

                        <div class="py-3">
                            <div class="flex justify-between pb-3">
                                <div>
                                    <img
                                        class="mx-auto h-20 w-20 rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <button
                                        class="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-slate-200 px-3 py-1.5 text-center text-xs font-normal text-slate-500 transition hover:bg-slate-300 focus:outline-none disabled:opacity-25"
                                    >
                                        <PencilSquareIcon class="mr-1.5 h-4 w-4 text-slate-500"></PencilSquareIcon>
                                        Edit
                                    </button>
                                </div>
                            </div>

                            <h3 class="font-poppins-bold pb-1 text-base font-medium text-slate-800">
                                Md. Mahbubul Islam
                            </h3>
                            <p class="font-poppins-regular text-xs font-medium text-slate-500">
                                Last Visited 12/08/2022
                            </p>
                        </div>

                        <div>
                            <ul
                                role="list"
                                class="divide-y divide-slate-100 pb-4"
                            >
                                <li class="py-2">
                                    <div class="flex items-center justify-between">
                                        <p class="font-poppins-regular text-sm font-medium text-slate-500">
                                            Patient ID
                                        </p>
                                        <p class="font-poppins-regular text-sm font-medium text-slate-800">38948397</p>
                                    </div>
                                </li>
                                <li class="py-2">
                                    <div class="flex items-center justify-between">
                                        <p class="font-poppins-regular text-sm font-medium text-slate-500">Gender</p>
                                        <p class="font-poppins-regular text-sm font-medium text-slate-800">Male</p>
                                    </div>
                                </li>
                                <li class="py-2">
                                    <div class="flex items-center justify-between">
                                        <p class="font-poppins-regular text-sm font-medium text-slate-500">Age</p>
                                        <p class="font-poppins-regular text-sm font-medium text-slate-800">10</p>
                                    </div>
                                </li>
                                <li class="py-2">
                                    <div class="flex items-center justify-between">
                                        <p class="font-poppins-regular text-sm font-medium text-slate-500">Weight</p>
                                        <p class="font-poppins-regular text-sm font-medium text-slate-800">20.3 kg</p>
                                    </div>
                                </li>
                                <li class="py-2">
                                    <div class="flex items-center justify-between">
                                        <p class="font-poppins-regular text-sm font-medium text-slate-500">Phone</p>
                                        <p class="font-poppins-regular text-sm font-medium text-slate-800">
                                            +8801963330999
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <div>
                                <button
                                    class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-skin-button-accent px-4 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-skin-button-accent-hover focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25 xl:text-base"
                                >
                                    <LibIconRx
                                        color="#ffffff"
                                        class="mr-2 h-6 w-6"
                                    ></LibIconRx>
                                    New Prescription
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="w-full rounded-lg bg-white p-3 shadow">
                        <p class="font-poppins-regular pb-4 text-sm text-slate-500">Other Patient</p>
                        <div class="grid grid-cols-3 gap-2">
                            <div
                                v-for="n in 3"
                                :key="n"
                                class="h-24 rounded-sm border border-slate-200 p-2"
                            >
                                <div class="mb-2">
                                    <img
                                        class="mx-auto h-10 w-10 rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                </div>
                                <p class="font-poppins-regular text-center text-xs text-slate-700">Golam Mahmud</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DashboardLayout>
</template>

<style scoped>
.height {
    height: calc(100vh - 200px);
}

.timeline-items {
    max-width: 1000px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    position: relative;
}

.timeline-items::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 100%;
    background-color: #64748b;
    left: calc(18% - 1px);
}
</style>
