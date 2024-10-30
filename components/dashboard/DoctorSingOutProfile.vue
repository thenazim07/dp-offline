<script setup>
import { ArrowUpTrayIcon } from '@heroicons/vue/24/solid';
import { useSettingsStore } from '~/stores/settings';

const settings = useSettingsStore();
const { profilePhoto } = globalMethods();
const { fullName, phoneNumber } = doctorInfo();

const { user, logout } = manageAuth();

const isOpen = computed(() => {
    return settings.isSidebarOpen;
});

const sidebarOpenClose = () => {
    if (!isOpen.value) {
        settings.sideBarToggle();
    }
};
</script>

<template>
    <div
        :class="isOpen ? 'border p-4' : 'w-16 2xl:w-20'"
        class="inset-x-0 rounded-lg border-slate-100 text-center"
    >
        <div
            class="pb-2"
            @click="sidebarOpenClose()"
        >
            <NuxtImg
                v-if="profilePhoto(user)"
                class="inline-block h-12 w-12 cursor-pointer rounded-full object-cover ring-2 ring-transparent ring-white"
                :src="profilePhoto(user)"
                :alt="fullName() ?? ''"
            />
        </div>

        <div v-if="isOpen">
            <p class="font-poppins-regular px-2 pb-1 text-sm text-slate-800 2xl:text-base">
                {{ fullName() }}
            </p>

            <p class="font-poppins-regular pb-4 text-xs text-slate-500">
                {{ phoneNumber() }}
            </p>

            <button
                class="font-poppins-regular inline-flex items-center space-x-1 rounded-md bg-slate-100 px-6 py-2 font-semibold text-slate-500 hover:bg-slate-200 focus:outline-none focus:outline-offset-1"
                type="button"
                @click="logout"
            >
                <ArrowUpTrayIcon class="h-5 w-5 rotate-90"></ArrowUpTrayIcon>
                <span>Sign out</span>
            </button>
        </div>
    </div>
</template>
