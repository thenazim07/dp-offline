<script lang="ts" setup>
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import type { Patient } from '~/repository/modules/Doctor/Patients/types';
import { usePatientStore } from '~/stores/usePatientStore';

const props = defineProps<{
    profile: Patient;
    loading?: boolean;
}>();

const patient = usePatientStore();
const { modalToggleForPatient } = patient;
const { hasPatientCreate } = storeToRefs(patient);
const { prescriptionInit } = managePrescription();

const name = computed(() => props?.profile?.title + ' ' + props?.profile?.name);
const gender = computed(() => props?.profile?.gender ?? '');
const weight = computed(() => props?.profile?.weight ?? '');
const patientID = computed(() => props?.profile?.generated_patient_id ?? '');
const visitDate = computed(() => props?.profile?.last_visit_date ?? null);
const phone = computed(() => props?.profile?.contact_no ?? null);

const writePrescription = (forPatient: Patient) => {
    navigateTo(`/dashboard/prescription/create`);
    setTimeout(() => {
        prescriptionInit(forPatient);
    }, 1000);
};
</script>

<template>
    <div class="mb-6 w-full rounded-lg bg-white p-5 shadow">
        <p class="font-poppins-regular text-sm text-slate-500">Patient Information</p>

        <div v-if="props?.loading">
            <div class="py-3">
                <div class="flex justify-between pb-3">
                    <USkeleton class="h-20 w-20 rounded-full" />
                    <USkeleton class="h-[30px] w-[69px] rounded-full" />
                </div>
            </div>
        </div>

        <template v-else>
            <div class="py-3">
                <div class="flex justify-between pb-3">
                    <div>
                        <img
                            class="mx-auto h-20 w-20 rounded-full"
                            :src="profilePhoto(profile)"
                            alt=""
                        />
                    </div>
                    <div>
                        <button
                            class="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-slate-200 px-3 py-1.5 text-center text-xs font-normal text-slate-500 transition hover:bg-slate-300 focus:outline-none disabled:opacity-25"
                            @click="modalToggleForPatient(true)"
                        >
                            <PencilSquareIcon class="mr-1.5 h-4 w-4 text-slate-500"></PencilSquareIcon>
                            Edit
                        </button>
                    </div>
                </div>

                <h3 class="font-poppins-bold pb-1 text-base font-medium text-slate-800">
                    {{ name }}
                </h3>

                <p
                    v-if="visitDate"
                    class="font-poppins-regular text-xs font-medium text-slate-500"
                >
                    Last Visited
                    {{
                        useDateFormat(visitDate, 'DD/MM/YYYY', {
                            locales: 'en-US',
                        }).value
                    }}
                </p>
                <span
                    v-else
                    class="font-poppins-regular text-xs font-medium text-slate-500"
                >
                    Last Visited : N/A
                </span>
            </div>

            <div>
                <ul
                    role="list"
                    class="divide-y divide-slate-100 pb-4"
                >
                    <li class="py-2">
                        <div class="flex items-center justify-between">
                            <p class="font-poppins-regular text-sm font-medium text-slate-500">Patient ID</p>
                            <p class="font-poppins-regular text-sm font-medium text-slate-800">
                                {{ patientID }}
                            </p>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center justify-between">
                            <p class="font-poppins-regular text-sm font-medium text-slate-500">Gender</p>
                            <p class="font-poppins-regular text-sm font-medium text-slate-800">
                                {{ gender }}
                            </p>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center justify-between">
                            <p class="font-poppins-regular text-sm font-medium text-slate-500">Age</p>
                            <p class="font-poppins-regular text-sm font-medium text-slate-800">
                                {{ props?.profile?.age ? props?.profile?.age + 'y' : '' }}
                                {{ props?.profile?.age_month ? props?.profile?.age_month + 'm' : '' }}
                                {{ props?.profile?.age_day ? props?.profile?.age_day + 'd' : '' }}
                            </p>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center justify-between">
                            <p class="font-poppins-regular text-sm font-medium text-slate-500">Weight</p>
                            <p class="font-poppins-regular text-sm font-medium text-slate-800">{{ weight }} kg</p>
                        </div>
                    </li>
                    <li class="py-2">
                        <div class="flex items-center justify-between">
                            <p class="font-poppins-regular text-sm font-medium text-slate-500">Phone</p>
                            <p class="font-poppins-regular text-sm font-medium text-slate-800">
                                {{ phone }}
                            </p>
                        </div>
                    </li>
                </ul>
                <div>
                    <button
                        class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-skin-button-accent px-4 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-skin-button-accent-hover focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 active:bg-skin-button-accent-hover disabled:opacity-25 xl:text-base"
                        @click="writePrescription(profile)"
                    >
                        <LibIconRx
                            color="#ffffff"
                            class="mr-2 h-6 w-6"
                        ></LibIconRx>
                        New Prescription
                    </button>
                </div>
            </div>
        </template>

        <UModal
            v-model="hasPatientCreate"
            :ui="{ width: 'w-full h-auto sm:max-w-2xl' }"
            prevent-close
        >
            <div class="flex items-start justify-between pl-6">
                <h3 class="font-poppins-regular my-6 text-xl font-normal text-slate-800 2xl:text-2xl">Edit Patient</h3>
                <div class="pr-1 pt-1.5">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-1"
                        @click="modalToggleForPatient(false)"
                    />
                </div>
            </div>

            <div class="px-6">
                <PatientRegisterForm :patient-info="props.profile" />
            </div>
        </UModal>
    </div>
</template>
