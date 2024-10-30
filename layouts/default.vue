<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon, Squares2X2Icon, UserGroupIcon } from '@heroicons/vue/24/solid';
import { useOnline } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '~/stores/settings';
import { useConfigsStore } from '~/stores/useConfigsStore';
const online = useOnline();
const { loading } = storeToRefs(useConfigsStore());
const settings = useSettingsStore();
const isOpen = computed(() => settings.isSidebarOpen);
const sidebarOpenClose = () => settings.sideBarToggle();
</script>

<template>
    <div
        class="relative h-full bg-slate-50"
        :class="loading ? 'h-screen max-h-screen' : 'min-h-screen'"
    >
        <div
            class="z-30 hidden bg-white pb-5 duration-300 md:fixed md:inset-y-0 md:flex-col xl:flex 2xl:pl-8"
            :class="isOpen ? 'xl:w-60 2xl:w-[17rem] ' : '2xl:w-[9rem]'"
        >
            <div
                class="mb-2 mr-1 mt-2 flex flex-1 flex-col overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
            >
                <button
                    class="group absolute -right-3 top-8 z-30 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-transparent bg-white shadow-sidebar-close-or-open hover:border-white hover:bg-blue-500 2xl:top-12"
                    @click="sidebarOpenClose()"
                >
                    <ChevronLeftIcon
                        v-if="isOpen"
                        class="h-4 w-4 font-bold text-slate-500 group-hover:text-white"
                    >
                    </ChevronLeftIcon>
                    <ChevronRightIcon
                        v-if="!isOpen"
                        class="h-4 w-4 font-bold text-slate-500 group-hover:text-white"
                    >
                    </ChevronRightIcon>
                </button>

                <div class="relative mb-12 flex h-24 items-center 2xl:mb-[60px] 2xl:h-[7rem]">
                    <div
                        v-if="isOpen"
                        class="mx-auto w-full px-3"
                    >
                        <UtilityApplicationNewLogo class="w-full object-cover"></UtilityApplicationNewLogo>
                    </div>

                    <UtilityApplicationSmallLogo
                        v-else
                        class="mx-auto w-16 2xl:ml-0 2xl:w-20"
                    ></UtilityApplicationSmallLogo>
                </div>

                <div>
                    <nav
                        class=""
                        aria-label="Sidebar"
                    >
                        <DashboardSidebarMenuItem
                            name="Dashboard"
                            route-name="dashboard"
                            to="/dashboard"
                            :text-show="Boolean(isOpen)"
                        >
                            <Squares2X2Icon
                                class="e mr-4 h-5 w-5"
                                :class="$route.name === 'dashboard' ? 'text-skin-base' : 'text-slate-500'"
                            ></Squares2X2Icon>
                        </DashboardSidebarMenuItem>

                        <DashboardSidebarMenuItem
                            name="Patients"
                            route-name="patients"
                            to="/patients"
                            :text-show="Boolean(isOpen)"
                        >
                            <UserGroupIcon
                                class="mr-4 h-5 w-5"
                                :class="$route.name === 'patients' ? 'text-skin-base' : 'text-slate-500'"
                            ></UserGroupIcon>
                        </DashboardSidebarMenuItem>

                        <DashboardSidebarMenuItem
                            name="Visits"
                            route-name="visits"
                            to="/visits"
                            :text-show="Boolean(isOpen)"
                        >
                            <LibIconRxSolid
                                class="mr-4 h-5 w-5"
                                :color="$route.name === 'visits' ? 'fill-[#136afb]' : 'fill-slate-500'"
                                :class="$route.name === 'visits' ? 'fill-[#136afb]' : 'fill-slate-500'"
                            ></LibIconRxSolid>
                        </DashboardSidebarMenuItem>

                        <DashboardSidebarMenuItemForSettings
                            name="Settings"
                            route-name="settings"
                            :text-show="Boolean(isOpen)"
                        >
                        </DashboardSidebarMenuItemForSettings>
                    </nav>
                </div>
            </div>

            <div class="xl:px-3 2xl:px-0 2xl:pr-6">
                <DashboardDoctorSingOutProfile></DashboardDoctorSingOutProfile>
            </div>
        </div>

        <div
            class="flex flex-1 flex-col duration-300"
            :class="isOpen ? 'xl:pl-[15rem] 2xl:pl-[17rem]' : 'xl:pl-[5rem] 2xl:pl-[9rem]'"
        >
            <div class="flex-1">
                <DashboardHeader>
                    <div
                        v-if="$route.name === 'dashboard'"
                        class="flex w-full items-center"
                    >
                        <div
                            id="navbar"
                            class="mr-8 w-full max-w-[66rem] 2xl:mr-16"
                        ></div>
                        <div
                            id="action"
                            class="w-full max-w-[20rem] bg-white 2xl:max-w-[29rem]"
                        ></div>
                    </div>

                    <div
                        v-else
                        id="navbar"
                    ></div>
                </DashboardHeader>

                <div
                    v-if="$route.name === 'dashboard'"
                    class="pl-8 pt-4 2xl:pl-[4rem]"
                >
                    <slot />
                </div>

                <div
                    v-else
                    class="pl-8 pt-4 2xl:pl-16 max-1919:pl-6"
                    :class="isOpen ? 'sm:pr-8' : 'pr-8 '"
                >
                    <slot />
                </div>
            </div>
        </div>

        <ClientOnly>
            <Teleport to="body">
                <div
                    v-if="!online"
                    class="fixed inset-0 z-50 bg-gray-100/60"
                >
                    <div
                        class="font-poppins-regular absolute bottom-10 left-8 z-50 inline-flex space-x-2 rounded-lg border-red-500 bg-white p-6 font-semibold shadow-2xl"
                    >
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-wifi-off text-slate-500"
                            >
                                <line
                                    x1="1"
                                    y1="1"
                                    x2="23"
                                    y2="23"
                                ></line>
                                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                                <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                                <line
                                    x1="12"
                                    y1="20"
                                    x2="12.01"
                                    y2="20"
                                ></line>
                            </svg>
                        </span>
                        <span>You are currently offline.</span>
                    </div>
                </div>
            </Teleport>
            <div
                v-if="loading"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20"
            >
                <div class="h-16 w-16">
                    <Vue3Lottie
                        animation-link="/images/LoaderRx.json"
                        :height="15"
                        :width="30"
                    />
                </div>
            </div>
        </ClientOnly>
    </div>
</template>
