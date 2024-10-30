<script lang="ts" setup>
import { ChevronRightIcon } from '@heroicons/vue/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import { useDoctorPatientStore } from '~/stores/doctor/patient';
const route = useRoute();
const { searchPatients } = useDoctorPatientStore();
const layoutsPatientSectionStore = useLayoutsPatientSectionStore();
const { selectedPatientForPatientSection } = storeToRefs(layoutsPatientSectionStore);
const { prescriptionInit } = managePrescription();

const patientDetailsData: Ref<any> = ref({});
const isOpen: Ref<boolean> = ref(false);
const patientList: Ref<any> = ref([]);
const loading: Ref<boolean> = ref(false);
const query: Ref<any> = ref('');

const searchPatientData = useDebounceFn(async (query: string) => {
    hoverParintPatient({});
    if (query.trim().length === 0) {
        patientList.value = [];
        return true;
    }
    loading.value = true;
    const res = await searchPatients(query);
    patientList.value = res?.data;
    loading.value = false;
}, 300);

const hoverParintPatient = (patientInfo: any) => (patientDetailsData.value = patientInfo);
const isSubPatientInfo = computed(() => patientDetailsData?.value?.id || false);
const operatingPatients = computed(() => patientDetailsData?.value?.operating_patients ?? []);

const emit = defineEmits(['close-component']);

const whenSelectedPatient = (user: any) => {
    console.log('patientclicked', user.id);
    layoutsPatientSectionStore.fetchPatientForPatientSectionPreview(user);
    emit('close-component');
    // if (route.name === 'dashboard-prescription-create') {
    //     prescriptionInit(user);
    // }

    // if (route.name === 'dashboard') {
    //     useLoading(true);
    //     navigateTo(`/dashboard/prescription/create`);
    //     setTimeout(() => {
    //         prescriptionInit(user);
    //     }, 2000);
    // }

    // if (route.name === 'patients') {
    //     return navigateTo(`/patients/details/${user.id}`);
    // }
};
</script>

<template>
    <section class="py-6">
        <div class="grid h-11 grid-cols-12 gap-8 2xl:h-12">
            <div class="col-span-12 flex items-center">
                <div class="flex-1">
                    <div>
                        <div class="relative">
                            <div class="relative w-full cursor-default overflow-hidden">
                                <div class="w-full">
                                    <input
                                        v-model="query"
                                        placeholder="Search Patient by phone/name or patient id"
                                        class="font-poppins-regular block h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm 2xl:h-12"
                                        @input="(e: Event) => searchPatientData(e?.target?.value)"
                                    />

                                    <div class="absolute inset-y-0 left-3 flex items-center">
                                        <MagnifyingGlassIcon
                                            class="h-5 w-5 text-slate-500"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>

                                <div
                                    v-if="loading"
                                    class="absolute inset-y-0 right-3 flex items-center"
                                >
                                    <LibIconLoadingCircle></LibIconLoadingCircle>
                                </div>
                            </div>

                            <div
                                class="absolute inset-x-0 z-30 mt-px grid w-full grid-cols-12 overflow-hidden rounded-b-lg rounded-t-lg bg-white shadow-xl transition-[height] duration-700 ease-out"
                                @mouseleave="hoverParintPatient({})"
                            >
                                <template v-if="patientList.length > 0 && query.length > 0">
                                    <div class="col-span-12">
                                        <div
                                            class="mr-1 max-h-[280px] overflow-y-auto py-3 pt-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
                                        >
                                            <ul class="px-3 2xl:space-y-2 2xl:px-5 2xl:py-3">
                                                <li
                                                    v-for="(user, index) in patientList"
                                                    :key="index"
                                                    class="group flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-slate-100"
                                                    @click="whenSelectedPatient(user)"
                                                    @mouseenter="hoverParintPatient(user)"
                                                >
                                                    <PatientSearchUserCardInfo :user="user">
                                                        <ChevronRightIcon
                                                            class="h-3 w-3 text-white group-hover:text-slate-500"
                                                        />
                                                    </PatientSearchUserCardInfo>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- <div
                                        class="col-span-7 overflow-y-auto bg-slate-50 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
                                    >
                                        <div
                                            v-if="isSubPatientInfo"
                                            class="h-full"
                                        >
                                            <figure class="space-y-2 p-2 2xl:space-y-4 2xl:p-4">
                                                <PatientSearchUserDetailsCard
                                                    :patient-details="patientDetailsData"
                                                    @select="whenSelectedPatient"
                                                />
                                                <template
                                                    v-for="(user, key) in operatingPatients"
                                                    :key="key"
                                                >
                                                    <PatientSearchUserDetailsCard
                                                        v-if="user"
                                                        :key="key"
                                                        :patient-details="user"
                                                        @select="whenSelectedPatient"
                                                    />
                                                </template>
                                            </figure>
                                        </div>
                                    </div> -->
                                </template>

                                <div
                                    v-if="query.length > 1 && patientList.length === 0"
                                    class="col-span-12 flex h-[280px] w-full items-center justify-center"
                                >
                                    <div>
                                        <p class="text-center text-xl font-semibold text-slate-900">No Patient found</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

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
