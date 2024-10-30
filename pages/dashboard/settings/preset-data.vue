<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
definePageMeta({
    middleware: ['auth'],
});
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#navbar">
                <div class="mr-0 flex w-full max-w-[100rem] items-center justify-between sm:pr-8">
                    <!--Breadcrumbs-->
                    <nav
                        class="flex"
                        aria-label="breadcrumb"
                    >
                        <ol
                            role="list"
                            class="flex items-center space-x-1"
                        >
                            <li>
                                <div class="flex items-center">
                                    <NuxtLink
                                        to="/dashboard"
                                        class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                    >
                                        Settings
                                    </NuxtLink>
                                </div>
                            </li>

                            <li>
                                <div class="flex items-center">
                                    <svg
                                        class="h-5 w-5 flex-shrink-0 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <a
                                        href="#"
                                        class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                        aria-current="page"
                                    >
                                        Presets</a
                                    >
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <!--End--Breadcrumbs-->
                </div>
            </Teleport>
        </ClientOnly>

        <div class="mr-0 max-w-[100rem] pb-20">
            <div class="flex rounded-lg bg-white shadow">
                <ClientOnly>
                    <TabGroup vertical>
                        <div class="w-full max-w-[16.5rem] flex-shrink-0 px-6 py-5 2xl:px-10 2xl:py-8">
                            <TabList class="space-y-6">
                                <!-- <Tab
              class="font-poppins-regular font-normal text-sm 2xl:text-base inline-block focus:outline-none w-full text-left"
              v-slot="{ selected }"
            >
              <button class="focus:outline-none" :class="{ 'text-blue-500 ': selected, ' text-slate-500': !selected }">
                Prescription Template
              </button>
            </Tab> -->

                                <Tab
                                    v-slot="{ selected }"
                                    class="2xl:tex-base font-poppins-regular inline-block w-full text-left text-sm font-normal focus:outline-none"
                                >
                                    <button
                                        class="focus:outline-none"
                                        :class="{
                                            'text-blue-500 ': selected,
                                            ' text-slate-500': !selected,
                                        }"
                                    >
                                        Chief Complaints
                                    </button>
                                </Tab>

                                <!-- <Tab
                                    v-slot="{ selected }"
                                    class="2xl:tex-base font-poppins-regular inline-block w-full text-left text-sm font-normal focus:outline-none"
                                >
                                    <button
                                        class="focus:outline-none"
                                        :class="{
                                            'text-blue-500 ': selected,
                                            ' text-slate-500': !selected,
                                        }"
                                    >
                                        History
                                    </button>
                                </Tab> -->

                                <Tab
                                    v-slot="{ selected }"
                                    class="2xl:tex-base font-poppins-regular inline-block w-full text-left text-sm font-normal focus:outline-none"
                                >
                                    <button
                                        class="focus:outline-none"
                                        :class="{
                                            'text-blue-500 ': selected,
                                            ' text-slate-500': !selected,
                                        }"
                                    >
                                        Diagnosis
                                    </button>
                                </Tab>

                                <Tab
                                    v-slot="{ selected }"
                                    class="2xl:tex-base font-poppins-regular inline-block w-full text-left text-sm font-normal focus:outline-none"
                                >
                                    <button
                                        class="focus:outline-none"
                                        :class="{
                                            'text-blue-500 ': selected,
                                            ' text-slate-500': !selected,
                                        }"
                                    >
                                        On Examinations
                                    </button>
                                </Tab>

                                <Tab
                                    v-slot="{ selected }"
                                    class="2xl:tex-base font-poppins-regular inline-block w-full text-left text-sm font-normal focus:outline-none"
                                >
                                    <button
                                        class="focus:outline-none"
                                        :class="{
                                            'text-blue-500 ': selected,
                                            ' text-slate-500': !selected,
                                        }"
                                    >
                                        Investigations
                                    </button>
                                </Tab>

                                <Tab
                                    v-slot="{ selected }"
                                    class="2xl:tex-base font-poppins-regular inline-block w-full text-left text-sm font-normal focus:outline-none"
                                >
                                    <button
                                        class="focus:outline-none"
                                        :class="{
                                            'text-blue-500 ': selected,
                                            ' text-slate-500': !selected,
                                        }"
                                    >
                                        Medicine
                                    </button>
                                </Tab>

                                <Tab
                                    v-slot="{ selected }"
                                    class="2xl:tex-base font-poppins-regular inline-block w-full text-left text-sm font-normal focus:outline-none"
                                >
                                    <button
                                        class="focus:outline-none"
                                        :class="{
                                            'text-blue-500 ': selected,
                                            ' text-slate-500': !selected,
                                        }"
                                    >
                                        Advices
                                    </button>
                                </Tab>

                                <Tab
                                    v-if="false"
                                    v-slot="{ selected }"
                                    class="2xl:tex-base font-poppins-regular inline-block w-full text-left text-sm font-normal focus:outline-none"
                                >
                                    <button
                                        class="focus:outline-none"
                                        :class="{
                                            'text-blue-500 ': selected,
                                            ' text-slate-500': !selected,
                                        }"
                                    >
                                        Special Notes
                                    </button>
                                </Tab>
                            </TabList>
                        </div>

                        <div class="flex-1 border-l border-slate-300 px-6 py-5 2xl:px-10 2xl:py-8">
                            <TabPanels>
                                <TabPanel>
                                    <LazyPresetChiefComplaints />
                                </TabPanel>

                                <!-- <TabPanel>
                                    <PresetTabTitle title="History" />
                                    <LazyPresetHistory />
                                </TabPanel> -->

                                <TabPanel>
                                    <LazyPresetDiagnosis />
                                </TabPanel>

                                <TabPanel>
                                    <LazyPresetObservation />
                                </TabPanel>

                                <TabPanel>
                                    <LazyPresetInvestigation />
                                </TabPanel>

                                <TabPanel>
                                    <LazyPresetMedicine />
                                </TabPanel>

                                <TabPanel>
                                    <LazyPresetAdvice />
                                </TabPanel>
                            </TabPanels>
                        </div>
                    </TabGroup>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>
