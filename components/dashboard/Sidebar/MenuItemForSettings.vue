<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ChevronDownIcon, Cog8ToothIcon } from '@heroicons/vue/24/solid';
import { useSettingsStore } from '~~/stores/settings';
const settings = useSettingsStore();

const isOpen = computed(() => {
    return settings.isSidebarOpen;
});

const sidebarOpen = () => {
    settings.sideBarOpen();
};

defineProps({
    name: {
        type: String,
        default: '',
    },
    routeName: {
        type: String,
        default: '',
    },

    textShow: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <ClientOnly>
        <div @click="sidebarOpen()">
            <Disclosure v-slot="{ open }">
                <div :class="open ? 'bg-slate-50' : ''">
                    <DisclosureButton
                        class="mb-px flex h-[3.75rem] w-full items-center justify-center"
                        :class="isOpen ? 'w-full' : '2xl:w-auto'"
                    >
                        <div
                            class="flex items-center"
                            :class="
                                textShow ? 'ml-[1.75rem] w-full justify-between pr-2' : 'w-auto justify-center 2xl:w-20'
                            "
                        >
                            <div class="flex items-center">
                                <Cog8ToothIcon
                                    class="mr-4 h-5 w-5"
                                    :class="open ? 'text-skin-base' : 'text-slate-500'"
                                >
                                </Cog8ToothIcon>
                                <span
                                    v-if="textShow"
                                    class="font-poppins-regular text-base"
                                >
                                    {{ name }}
                                </span>
                            </div>

                            <div v-if="isOpen">
                                <ChevronDownIcon
                                    :class="open ? 'rotate-180 transform' : ''"
                                    class="h-5 w-5 text-slate-500"
                                />
                            </div>
                        </div>
                    </DisclosureButton>

                    <transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                    >
                        <DisclosurePanel
                            v-if="open && isOpen"
                            class="pb-4 pt-1"
                            :class="textShow ? 'ml-9 ' : ''"
                        >
                            <div class="hidden sm:block">
                                <ul class="border-l border-slate-200">
                                    <li class="-ml-px space-y-2">
                                        <NuxtLink
                                            to="/dashboard/settings/profile"
                                            :class="[
                                                $route.name === 'dashboard-settings-profile'
                                                    ? 'border-blue-500 bg-slate-100'
                                                    : 'border-transparent text-slate-800 hover:border-blue-500 hover:bg-slate-100 hover:text-slate-800',
                                                'font-poppins-regular inline-block w-full whitespace-nowrap border-l-2 px-4 py-3 text-base font-medium',
                                            ]"
                                        >
                                            Profile
                                        </NuxtLink>
                                    </li>

                                    <li
                                        v-if="false"
                                        class="-ml-px space-y-2"
                                    >
                                        <NuxtLink
                                            to="/dashboard/settings/profile"
                                            :class="[
                                                $route.name === 'dashboard-settings-profile1'
                                                    ? 'border-blue-500 bg-slate-100'
                                                    : 'border-transparent text-slate-800 hover:border-blue-500 hover:bg-slate-100 hover:text-slate-800',
                                                'font-poppins-regular inline-block w-full whitespace-nowrap border-l-2 px-4 py-3 text-base font-medium',
                                            ]"
                                        >
                                            Rx Layout
                                        </NuxtLink>
                                    </li>

                                    <li class="-ml-px space-y-2">
                                        <NuxtLink
                                            to="/dashboard/settings/print-layout"
                                            :class="[
                                                $route.name === 'dashboard-settings-print-layout'
                                                    ? 'border-blue-500 bg-slate-100'
                                                    : 'border-transparent text-slate-800 hover:border-blue-500 hover:bg-slate-100 hover:text-slate-800',
                                                'font-poppins-regular inline-block w-full whitespace-nowrap border-l-2 px-4 py-3 text-base font-medium',
                                            ]"
                                        >
                                            Print Layout
                                        </NuxtLink>
                                    </li>

                                    <li class="-ml-px space-y-2">
                                        <NuxtLink
                                            to="/dashboard/settings/preset-data"
                                            :class="[
                                                $route.name === 'dashboard-settings-preset-data'
                                                    ? 'border-blue-500 bg-slate-100'
                                                    : 'border-transparent text-slate-800 hover:border-blue-500 hover:bg-slate-100 hover:text-slate-800',
                                                'font-poppins-regular inline-block w-full whitespace-nowrap border-l-2 px-4 py-3 text-base font-medium',
                                            ]"
                                        >
                                            Preset Data
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </div>
                        </DisclosurePanel>
                    </transition>
                </div>
            </Disclosure>
        </div>
    </ClientOnly>
</template>
