<script lang="ts" setup>
import { usePrescriptionStore, type Info } from '@/stores/prescription/usePrescriptionStore';
import { usePrescriptionDrugFrequenciesStore } from '~/stores/prescription/drug/frequencies';
import { usePrescriptionDrugInstructionsStore } from '~/stores/prescription/drug/instructions';
import { usePrescriptionFinishedStore } from '~/stores/prescription/finishedPrescription';
import { useDoctorPatientStore } from '~/stores/doctor/patient';
import { useLayoutsStore } from '~/stores/useLayoutsStore';
import { useSettingsStore } from '@/stores/settings';
import { useRndStore } from '~/stores/prescription/rnd/useRndStore';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';

const prescriptionTemplateStore = usePrescriptionTemplateStore();
const { fullPrescriptionTemplate } = storeToRefs(prescriptionTemplateStore);
const rndStore = useRndStore();
const route = useRoute();
const router = useRouter();

const { featchPrescriptionInformation } = usePrescriptionFinishedStore();
const { featchPatientInfoForPrescription } = useDoctorPatientStore();

const prescriptionStore = usePrescriptionStore();
const { hasSelectedPatient, currentTemplateId } = storeToRefs(prescriptionStore);
const { resetPrescription } = prescriptionStore;
const { initialize } = useLayoutsStore();
const { bodySectionFormData } = storeToRefs(useLayoutsStore());
const settings = useSettingsStore();

definePageMeta({
    middleware: ['auth'],
});

// api call
initialize();
const { pending } = await useLazyAsyncData('patient-info', () => {
    return featchPatientInfoForPrescription();
});

// load all presets, groups
await useLazyAsyncData('loadPrescriptionConfigs', prescriptionStore.loadPrescriptionConfigs, {
    server: false,
});

async function loadTemplateData() {
    const templateId = route.query?.templateId;
    if (templateId) {
        await prescriptionTemplateStore.fetchFullPrescriptionTemplate(templateId as string);

        prescriptionStore.setPrescriptionInfomation(
            fullPrescriptionTemplate.value?.prescription as unknown as Info,
            undefined,
            undefined,
        );

        currentTemplateId.value = templateId as string;

        if (selectedPatient?.value?.id) {
            await prescriptionInit(selectedPatient.value);
            await featchPrescriptionInformation();
            currentTemplateId.value = null;
            await router.replace({ query: { templateId: undefined } });
        }
    }
}
const { selectedPatient, prescriptionInit } = managePrescription();
watch(
    () => route.query?.templateId,
    async (newValue) => {
        if (!newValue) return;

        await loadTemplateData();
    },
    // {
    //     immediate: true,
    // },
);

onMounted(async () => {
    await featchPrescriptionInformation();
    setTimeout(() => {
        useLoading(false);
    }, 5000);

    await loadTemplateData();

    await useLayoutsStore().fetchBodySection();
});

// settings
const isOpen = computed(() => settings.isSidebarOpen);
const sideBarClosed = () => isOpen.value && settings.sideBarToggle();
sideBarClosed();

const previewPrescription = async () => {
    const info = usePrescriptionInitializedInfo();
    if (!info) return;

    useLoading(true);

    const { data: generate, error } = await useApiFetch<any>(
        `/generate/prescription/${info.prescription_ref}?version=${useRuntimeConfig().public.PRESCRIPTION_VERSION}`,
    );

    if (generate?.value) {
        await openPdfForNewTab(generate.value.data.src);
        useLoading(false);
    }

    if (error.value) {
        alert(error?.value.data?.message || 'An error occurred');
        useLoading(false);
    }
};
const toast = useToast();
const loading = ref(false);

const openPdfForNewTab = (href: string) => {
    // const link = document.createElement('a');
    // link.href = href;
    // link.target = '_blank';
    // link.click();

    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer'; // For security reasons
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    resetPrescription();
};

const PrescriptionSavingStatusStore = usePrescriptionSavingStatusStore();
const { isErrorWhileSavingAnySection, isLoadingWhileSavingAnySection } = storeToRefs(PrescriptionSavingStatusStore);
</script>

<template>
    <div>
        <div
            v-if="pending"
            class="max-w-[100rem]"
        >
            <div class="rounded-lg bg-white p-8 shadow">
                <div class="mb-3">
                    <USkeleton class="mb-3 h-[150px]" />
                    <USkeleton class="h-14" />
                </div>
                <div>
                    <USkeleton class="h-[700px] w-full" />
                </div>
            </div>
        </div>

        <template v-else>
            <ClientOnly>
                <Teleport to="#navbar">
                    <div class="pr-8">
                        <div class="mr-0 flex max-w-[100rem] items-center justify-between">
                            <div class="mr-12 flex w-7/12 items-center gap-4 2xl:col-span-7">
                                <div class="flex-grow">
                                    <label
                                        for="search"
                                        class="sr-only"
                                    >
                                        Search prescription templates
                                    </label>
                                    <PrescriptionSearchPrescriptionTemplates />
                                </div>
                                <PrescriptionEditPrescriptionLayoutNavigationPrescriptionLayoutButton />
                            </div>

                            <div class="w-5/12 bg-white">
                                <div class="flex w-full justify-end">
                                    <button
                                        v-if="hasSelectedPatient"
                                        :disabled="
                                            loading || isErrorWhileSavingAnySection || isLoadingWhileSavingAnySection
                                        "
                                        class="font-poppins-semibold group mr-2 inline-flex w-full max-w-xs items-center justify-center rounded-md border border-[#136AFB] bg-white px-4 py-2.5 text-center text-sm font-semibold text-skin-base shadow-sm hover:bg-skin-button-accent-hover hover:text-white focus:outline-none disabled:cursor-not-allowed disabled:border-[#CBD5E1] hover:disabled:bg-transparent 2xl:mr-4 2xl:text-base"
                                        :class="[isLoadingWhileSavingAnySection ? 'border-[#64748B]' : '']"
                                        @click="previewPrescription"
                                    >
                                        <span
                                            v-if="!loading && !isLoadingWhileSavingAnySection"
                                            class="mr-2 h-6 w-6"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                            >
                                                <g
                                                    class="stroke-[#136afb] group-hover:stroke-white group-disabled:stroke-[#CBD5E1]"
                                                    fill="none"
                                                    stroke="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="1.5"
                                                    data-name="Group 28293"
                                                >
                                                    <path
                                                        d="M13.228 21h-8.8A1.458 1.458 0 0 1 3 19.519V4.479a1.458 1.458 0 0 1 1.433-1.48h11.819a1.458 1.458 0 0 1 1.433 1.48v4.44"
                                                        data-name="Path 26400"
                                                    />
                                                    <path
                                                        d="M5.571 8.252h7.657"
                                                        data-name="Line 796"
                                                    />
                                                    <path
                                                        d="M5.6 11.498h4"
                                                        data-name="Line 797"
                                                    />
                                                    <path
                                                        d="M5.629 14.744H8"
                                                        data-name="Line 798"
                                                    />
                                                    <g
                                                        data-name="Ellipse 1497"
                                                        transform="translate(10.543 10.371)"
                                                    >
                                                        <circle
                                                            cx="4.5"
                                                            cy="4.5"
                                                            r="4.5"
                                                            stroke="none"
                                                        />
                                                        <circle
                                                            cx="4.5"
                                                            cy="4.5"
                                                            r="3.75"
                                                        />
                                                    </g>
                                                    <path
                                                        d="m21 21-3.229-3.229"
                                                        data-name="Line 799"
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                        <span v-else>
                                            <LibIconLoadingCircle />
                                        </span>
                                        <span
                                            class="group-disabled:text-[#CBD5E1]"
                                            :class="[isLoadingWhileSavingAnySection ? 'text-[#64748B]' : '']"
                                            >{{
                                                loading || isLoadingWhileSavingAnySection ? 'Saving...' : 'Save & Print'
                                            }}
                                        </span>
                                    </button>
                                    <PrescriptionTemplateSaveAsTemplate
                                        :hasSelectedPatient="hasSelectedPatient ?? false"
                                        :loading="loading"
                                    />
                                    <!-- <button
                                        v-if="false"
                                        class="font-poppins-semibold group ml-2 inline-flex w-full items-center justify-center rounded-md border border-[#136AFB] bg-white px-4 py-2.5 text-center text-sm font-semibold text-skin-base shadow-sm hover:bg-skin-button-accent-hover hover:text-white focus:outline-none 2xl:ml-4 2xl:text-base"
                                    >
                                        <span class="mr-2 h-5 w-5">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                            >
                                                <g
                                                    fill="none"
                                                    class="stroke-[#136afb] group-hover:stroke-white"
                                                    stroke="none"
                                                    stroke-linejoin="round"
                                                    stroke-width="1.5"
                                                    data-name="Group 28296"
                                                >
                                                    <path
                                                        d="M11.55 3H3v10.154h8.55Z"
                                                        data-name="Path 26401"
                                                    />
                                                    <path
                                                        d="M21 16.846H3V21h18Z"
                                                        data-name="Path 26402"
                                                    />
                                                    <path
                                                        d="M21 3h-5.85v3.692H21Z"
                                                        data-name="Path 26403"
                                                    />
                                                    <path
                                                        d="M21 9.462h-5.85v3.692H21Z"
                                                        data-name="Path 26404"
                                                    />
                                                </g>
                                            </svg>
                                        </span>
                                        <span> Save as Template </span>
                                    </button> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </Teleport>
            </ClientOnly>

            <ClientOnly>
                <template #fallback>
                    <div class="max-w-[100rem]">
                        <div class="rounded-lg bg-white p-8 shadow">
                            <div class="mb-3">
                                <USkeleton class="mb-3 h-[150px]" />
                                <USkeleton class="h-14" />
                            </div>
                            <div class="mb-2">
                                <USkeleton class="h-[700px] w-full" />
                            </div>
                            <USkeleton class="mb-3 h-[150px]" />
                        </div>
                    </div>
                </template>

                <div class="mr-0 max-w-[100rem] pb-32">
                    <div class="flex-col rounded-lg bg-white p-8 shadow">
                        <PrescriptionHeaderSection />
                        <PrescriptionPatientSectionPrint v-if="hasSelectedPatient" />
                        <PrescriptionSearchWithNewPatient v-else />

                        <section
                            class="m-0 flex h-[calc(100%_-_20rem)] flex-1 border-b border-slate-500"
                            @click="
                                () => {
                                    if (!hasSelectedPatient) {
                                        toast.add({ title: 'Please select patient first', color: 'red' });
                                    }
                                }
                            "
                        >
                            <PrescriptionLeftSide
                                :class="{
                                    'pointer-events-none': !hasSelectedPatient,
                                }"
                            >
                                <!-- RND Start -->
                                <!-- <SearchTest /> -->
                                <!-- <PrescriptionRndPopoverModel />

                                <div>
                                    Selected data:
                                    <p>
                                        name: {{ rndStore.name }} <br />
                                        email: {{ rndStore.email }}
                                    </p>
                                </div> -->
                                <!-- RND End -->

                                <!-- <PrescriptionOptionsChiefComplaintsOld /> -->
                                <!-- <div
                                    v-for="components in [
                                        'Chief Complaints',
                                        'History',
                                        'Diagnosis',
                                        'On Examinations',
                                        'Investigation',
                                    ]"
                                    :key="components"
                                    class="min-h-[8rem]"
                                >
                                    <PrescriptionOptionsChiefComplaints v-if="components === 'Chief Complaints'" />
                                    <PrescriptionOptionsDiagnosis v-if="components === 'Diagnosis'" />
                                    <PrescriptionOptionsDiagnosisOld v-if="components === 'Diagnosis'" />
                                    <PrescriptionOptionsOnExaminations v-if="components === 'On Examinations'" />
                                    <PrescriptionOptionsOnExaminationsOld v-if="components === 'On Examinations'" />
                                    <PrescriptionOptionsEhr v-if="components === 'History'" />
                                    <PrescriptionOptionsHistoryOld v-if="components === 'History'" />
                                    <PrescriptionOptionsInvestigation v-if="components === 'Investigation'" />
                                    <PrescriptionOptionsInvestigationOld v-if="components === 'Investigation'" />
                                </div> -->

                                <div
                                    v-for="(value, key) in bodySectionFormData.body.columns.column0.items"
                                    :key="key"
                                    class="min-h-[8rem]"
                                >
                                    <PrescriptionOptionsDrug
                                        v-if="key === 'drug'"
                                        :key="key"
                                    />
                                    <!-- <PrescriptionOptionsMedicineOld /> -->
                                    <PrescriptionOptionsAdvice
                                        v-if="key === 'advise'"
                                        :key="key"
                                    />
                                    <!-- <PrescriptionOptionsAdviceOld /> -->
                                    <PrescriptionOptionsFollowUp
                                        v-if="key === 'follow_up'"
                                        :key="key"
                                    />
                                    <!-- <PrescriptionOptionsFollowUpOld /> -->

                                    <PrescriptionOptionsChiefComplaints
                                        v-if="key === 'indication'"
                                        :key="key"
                                    />
                                    <PrescriptionOptionsDiagnosis
                                        v-if="key === 'diagnosis'"
                                        :key="key"
                                    />
                                    <!-- <PrescriptionOptionsDiagnosisOld v-if="components === 'Diagnosis'" /> -->
                                    <PrescriptionOptionsOnExaminations
                                        v-if="key === 'on_examination'"
                                        :key="key"
                                    />
                                    <!-- <PrescriptionOptionsOnExaminationsOld v-if="components === 'On Examinations'" /> -->
                                    <PrescriptionOptionsEhr
                                        v-if="key === 'past_history'"
                                        :key="key"
                                    />
                                    <!-- <PrescriptionOptionsHistoryOld v-if="components === 'History'" /> -->
                                    <PrescriptionOptionsInvestigation
                                        v-if="key === 'investigation'"
                                        :key="key"
                                    />
                                </div>
                            </PrescriptionLeftSide>

                            <div
                                class="flex-1"
                                :class="{
                                    'pointer-events-none': !hasSelectedPatient,
                                }"
                            >
                                <div class="pl-10 pt-10">
                                    <template v-for="(value, key) in bodySectionFormData.body.columns.column1.items">
                                        <PrescriptionOptionsDrug
                                            v-if="key === 'drug'"
                                            :key="key"
                                        />
                                        <!-- <PrescriptionOptionsMedicineOld /> -->
                                        <PrescriptionOptionsAdvice
                                            v-if="key === 'advise'"
                                            :key="key"
                                        />
                                        <!-- <PrescriptionOptionsAdviceOld /> -->
                                        <PrescriptionOptionsFollowUp
                                            v-if="key === 'follow_up'"
                                            :key="key"
                                        />
                                        <!-- <PrescriptionOptionsFollowUpOld /> -->

                                        <PrescriptionOptionsChiefComplaints
                                            v-if="key === 'indication'"
                                            :key="key"
                                        />
                                        <PrescriptionOptionsDiagnosis
                                            v-if="key === 'diagnosis'"
                                            :key="key"
                                        />
                                        <!-- <PrescriptionOptionsDiagnosisOld v-if="components === 'Diagnosis'" /> -->
                                        <PrescriptionOptionsOnExaminations
                                            v-if="key === 'on_examination'"
                                            :key="key"
                                        />
                                        <!-- <PrescriptionOptionsOnExaminationsOld v-if="components === 'On Examinations'" /> -->
                                        <PrescriptionOptionsEhr
                                            v-if="key === 'past_history'"
                                            :key="key"
                                        />
                                        <!-- <PrescriptionOptionsHistoryOld v-if="components === 'History'" /> -->
                                        <PrescriptionOptionsInvestigation
                                            v-if="key === 'investigation'"
                                            :key="key"
                                        />
                                    </template>
                                </div>
                            </div>
                        </section>

                        <PrescriptionFooterSection />
                    </div>
                </div>
            </ClientOnly>
        </template>
    </div>
</template>
