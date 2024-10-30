<script setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
import { useDoctorPatientStore } from '~/stores/doctor/patient';
import { usePrescriptionStore } from '~/stores/prescription/usePrescriptionStore';

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();
const { featchPatientVisitDetails } = useDoctorPatientStore();

const patientID = ref(route.params.id);

const {
    data: patientDetailsInfo,
    pending,
    execute,
} = await useLazyAsyncData('visit-details', () => featchPatientVisitDetails(patientID.value));

const selectedOtherPatient = (patient_id) => {
    patientID.value = patient_id;
    execute();
};

const visitList = computed(() => patientDetailsInfo?.value?.visit ?? {});
const otherPatients = computed(() => patientDetailsInfo?.value?.operating_patients ?? []);
const { prescriptionInitForFollowUp } = managePrescription();

const writeForCopyPrescription = async (forPatient, visit) => {
    setTimeout(() => {
        useLoading(true);
        prescriptionInitForFollowUp(forPatient, visit);
    }, 1000);

    return await navigateTo(`/dashboard/prescription/create`);
};

async function editPrescription(visit) {
    await usePrescriptionStore().resetPrescription();
    useLoading(true);
    try {
        usePrescriptionStore().setCookiePrescriptionInformation({
            doctor_ref: visit?.doctor_id,
            prescription_ref: visit?.prescription_ref,
            visit_ref: visit.id,
            patient_ref: visit.patient_id,
        });

        const patientInfo = await usePrescriptionStore().fetchPatientInfo(visit.patient_id);

        if (patientInfo.data) {
            usePrescriptionStore().setPrescriptionPatientInfo(patientInfo.data);
        }

        return await navigateTo(`/dashboard/prescription/create`);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error during edit prescription', error);
        usePrescriptionStore().setPrescriptionPatientInfo({});
        useLoading(false);
    }
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8 pr-8">
        <div class="relative col-span-8 mb-6 w-full rounded-lg bg-white shadow">
            <TabGroup>
                <TabList
                    class="sticky top-0 z-10 overflow-hidden rounded-t-md bg-white px-6 pt-6"
                    as="div"
                >
                    <div class="block w-full border-b border-gray-200">
                        <div class="flex space-x-6">
                            <Tab
                                v-slot="{ selected }"
                                class="focus:outline-none"
                            >
                                <div class="relative flex">
                                    <p
                                        type="button"
                                        class="font-poppins-regular relative z-10 -mb-1 flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out hover:text-[#136AFB]"
                                        :class="
                                            selected
                                                ? 'border-[#136AFB] text-[#136AFB]'
                                                : 'border-transparent text-slate-500'
                                        "
                                    >
                                        <span class="flex items-center py-2 font-semibold">
                                            <LibIconRxSolid class="mr-1"></LibIconRxSolid>
                                            Visits ({{ visitList.length }})
                                        </span>
                                    </p>
                                </div>
                            </Tab>

                            <Tab
                                v-if="false"
                                v-slot="{ selected }"
                                class="focus:outline-none"
                            >
                                <div class="relative flex">
                                    <p
                                        type="button"
                                        class="font-poppins-regular relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                                        :class="
                                            selected
                                                ? 'border-[#136AFB] text-[#136AFB]'
                                                : 'border-transparent text-slate-500'
                                        "
                                    >
                                        <span class="flex items-center py-2 font-semibold">
                                            <LibIconIcSummery
                                                class="mr-1"
                                                :color="activeTabName === 'summery' ? '#136AFB' : '#64748b'"
                                            ></LibIconIcSummery>
                                            Summery
                                        </span>
                                    </p>
                                </div>
                            </Tab>
                        </div>
                    </div>
                </TabList>

                <TabPanels
                    class="height mb-2 mr-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
                    as="div"
                >
                    <TabPanel>
                        <div class="timeline-items">
                            <PatientFollowUpCard
                                v-for="(visit, index) in visitList"
                                :key="index"
                                :visit="visit"
                            >
                                <button
                                    v-if="visit.prescription_src"
                                    type="button"
                                    class="group float-right inline-flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-semibold text-gray-600 shadow-sm hover:border-transparent hover:bg-[#F59E0B] hover:text-white"
                                    @click="writeForCopyPrescription(patientDetailsInfo, visit)"
                                >
                                    <LibIconRx
                                        color="#ffffff"
                                        class="mr-2 hidden h-4 w-4 group-hover:block"
                                    ></LibIconRx>
                                    <LibIconRx class="mr-2 h-4 w-4 group-hover:hidden"></LibIconRx>
                                    Follow up
                                </button>
                                <button
                                    v-if="!visit.prescription_src"
                                    type="button"
                                    class="group float-right inline-flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-semibold text-gray-600 shadow-sm hover:border-transparent hover:bg-[#F59E0B] hover:text-white"
                                    @click="editPrescription(visit)"
                                >
                                    <LibIconRx
                                        color="#ffffff"
                                        class="mr-2 hidden h-4 w-4 group-hover:block"
                                    ></LibIconRx>
                                    <LibIconRx class="mr-2 h-4 w-4 group-hover:hidden"></LibIconRx>
                                    Edit
                                </button>
                            </PatientFollowUpCard>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <PatientHistory></PatientHistory>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>

        <div class="col-span-4">
            <PatientProfileCard
                v-if="patientDetailsInfo"
                :profile="patientDetailsInfo"
                :loading="pending"
            />

            <PatientOtherPatient v-if="otherPatients && otherPatients.length > 0">
                <PatientOtherPatientCard
                    v-for="info in otherPatients"
                    :key="info.id"
                    :profile="info"
                    @select="selectedOtherPatient"
                />
            </PatientOtherPatient>
        </div>
    </div>
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
