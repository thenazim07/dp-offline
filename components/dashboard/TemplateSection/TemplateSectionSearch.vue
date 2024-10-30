<script setup lang="ts">
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/vue/24/solid';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { useSettingsStore } from '~/stores/settings';
const settingsStore = useSettingsStore();

const { showViewName } = storeToRefs(settingsStore);

const prescriptionTemplateStore = usePrescriptionTemplateStore();

const { searchQuery } = storeToRefs(prescriptionTemplateStore);

function onButtonClickHandler() {
    settingsStore.viewToggle();
}
</script>

<template>
    <div class="mb-8 flex items-center space-x-5 px-5">
        <div class="flex-1">
            <div class="w-full">
                <label
                    for="search"
                    class="sr-only"
                >
                    Search Patient by phone/name or patient id
                </label>
                <div class="relative text-indigo-200 focus-within:text-gray-400">
                    <input
                        id="search"
                        v-model="searchQuery"
                        class="font-poppins-regular block w-full rounded-sm border border-slate-300 bg-white py-2.5 pl-6 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder="Search template"
                    />
                </div>
            </div>
        </div>

        <div class="">
            <button
                v-if="showViewName === 'grid'"
                class="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-50 hover:bg-slate-100"
                @click.prevent="onButtonClickHandler"
            >
                <ListBulletIcon class="h-5 w-5 text-slate-500"></ListBulletIcon>
            </button>

            <button
                v-else
                class="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-50 hover:bg-slate-100"
                @click.prevent="onButtonClickHandler"
            >
                <Squares2X2Icon class="h-5 w-5 text-slate-500" />
            </button>
        </div>
    </div>
</template>
