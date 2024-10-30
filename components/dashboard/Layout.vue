<script lang="ts" setup>
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    Cog8ToothIcon,
    Squares2X2Icon,
    UserGroupIcon,
} from '@heroicons/vue/24/solid';

import { useSettingsStore } from '~~/stores/settings';
const settings = useSettingsStore();

const open = computed(() => {
    return settings.isSidebarOpen;
});

const sidebarOpenClose = () => {
    settings.sideBarToggle();
};
</script>

<template>
    <div class="min-h-screen bg-slate-50">
        <div
            :class="open ? 'w-56 2xl:w-72' : 'w-20'"
            class="z-30 bg-white pb-5 duration-300 md:fixed md:inset-y-0 md:flex md:flex-col"
        >
            <div class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <button
                    class="group absolute -right-3 top-5 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-transparent bg-white shadow-sidebar-close-or-open hover:border-white hover:bg-blue-500"
                    @click="sidebarOpenClose()"
                >
                    <ChevronLeftIcon
                        v-if="open"
                        class="h-4 w-4 font-bold text-slate-500 group-hover:text-white"
                    ></ChevronLeftIcon>
                    <ChevronRightIcon
                        v-if="!open"
                        class="h-4 w-4 font-bold text-slate-500 group-hover:text-white"
                    ></ChevronRightIcon>
                </button>

                <UtilityApplicationLogo
                    v-if="open"
                    class="h-[64px] w-full px-4"
                />

                <UtilityApplicationSmallLogo
                    v-else
                    class="mt-[21px] pl-2 pr-4"
                ></UtilityApplicationSmallLogo>

                <div>
                    <nav
                        class="mt-20 flex-1 space-y-1"
                        aria-label="Sidebar"
                    >
                        <NuxtLink
                            to="/dashboard"
                            :class="$route.name === 'dashboard' ? 'border-[#136AFB] bg-slate-50' : 'border-transparent'"
                            class="font-poppins-regular flex items-center space-x-4 border-l-4 px-6 py-3 text-base"
                        >
                            <Squares2X2Icon class="h-6 w-6 text-skin-base"></Squares2X2Icon>
                            <span v-if="open">Dashboard</span>
                        </NuxtLink>

                        <NuxtLink
                            to="/patients"
                            :class="$route.name === 'patients' ? 'border-[#136AFB] bg-slate-50' : 'border-transparent'"
                            class="font-poppins-regular group flex items-center space-x-4 border-l-4 px-6 py-3 text-base hover:border-[#136AFB] hover:bg-slate-50"
                        >
                            <UserGroupIcon class="h-6 w-6 text-slate-500 group-hover:text-skin-base"></UserGroupIcon>
                            <span v-if="open">Patients</span>
                        </NuxtLink>

                        <a
                            href="#"
                            class="font-poppins-regular group flex items-center space-x-4 border-l-4 border-transparent px-6 py-3 text-base hover:border-[#136AFB] hover:bg-slate-50"
                        >
                            <Cog8ToothIcon class="h-6 w-6 text-slate-500 group-hover:text-skin-base"></Cog8ToothIcon>
                            <span v-if="open">Settings</span>
                        </a>
                    </nav>
                </div>
            </div>

            <div class="px-4">
                <DashboardDoctorSingOutProfile></DashboardDoctorSingOutProfile>
            </div>
        </div>

        <div
            class="flex flex-1 flex-col duration-300"
            :class="open ? 'md:pl-56 2xl:pl-72' : 'pl-20'"
        >
            <div class="flex-1">
                <DashboardHeader>
                    <slot name="navbar"></slot>
                </DashboardHeader>

                <div class="pl-8 pt-4 2xl:pl-12">
                    <slot name="main"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
