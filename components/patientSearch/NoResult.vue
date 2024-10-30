<script lang="ts" setup>
import { PlusCircleIcon } from '@heroicons/vue/24/outline';
const isOpen = ref(false);
</script>

<template>
    <div class="z-30 mt-px h-72 w-full">
        <div class="w-full text-center">
            <div class="h-auto w-20 pb-6">
                <NuxtImg src="/images/no_result.svg" />
            </div>
            <p class="font-poppins-bold pb-2 font-semibold text-slate-800">No Result Found</p>
            <p class="font-poppins-regular pb-3 text-base font-normal text-slate-500">
                We've searched and did not find any patient.
            </p>

            <button
                class="tracking-wides font-poppins-semibold inline-flex w-full items-center justify-center rounded-md border border-transparent bg-skin-button-accent px-4 py-[.68rem] text-center text-xs font-semibold text-white transition hover:bg-skin-button-accent-hover focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25 2xl:text-base"
                @click="isOpen = true"
            >
                <PlusCircleIcon class="mr-2 h-6 w-6 text-white"></PlusCircleIcon>
                New Patient
            </button>
        </div>
    </div>

    <UModal
        v-model="isOpen"
        :ui="{ width: 'w-full h-auto sm:max-w-2xl' }"
        prevent-close
    >
        <div class="flex items-start justify-between pl-6">
            <h3 class="font-poppins-regular my-6 text-xl font-normal text-slate-800 2xl:text-2xl">Add New Patient</h3>
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
            <PatientRegisterForm />
        </div>
    </UModal>
</template>
