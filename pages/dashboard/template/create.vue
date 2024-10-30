<script lang="ts" setup>
import { object, string } from 'yup';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { usePrescriptionStore, type Info } from '~/stores/prescription/usePrescriptionStore';
definePageMeta({
    middleware: ['auth'],
});

const prescriptionStore = usePrescriptionStore();
const prescriptionTemplateStore = usePrescriptionTemplateStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const {
    isPrescriptionTemplateEditMode,
    currentPrescriptionTemplate,
    fullPrescriptionTemplate,
    storePrescriptionTemplatePayload,
} = storeToRefs(prescriptionTemplateStore);

const initialValues = {
    name: '',
    source: '',
};

const schema = object({
    name: string().required().email(),
    source: string().required().min(6),
});

const createTemplate = () => {
    // eslint-disable-next-line no-console
    console.log('work..');
};

function showErrorMessage() {
    toast.add({ title: 'Please save template first', color: 'red' });
}

async function loadTemplate() {
    if (route.query?.templateId) {
        await prescriptionTemplateStore.fetchFullPrescriptionTemplate(route.query?.templateId as string);
        currentPrescriptionTemplate.value = fullPrescriptionTemplate.value?.prescription_template || null;
        storePrescriptionTemplatePayload.value = {
            description: currentPrescriptionTemplate.value?.description || '',
            name: currentPrescriptionTemplate.value?.name || '',
            score: currentPrescriptionTemplate.value?.score || 0,
        };
        prescriptionTemplateStore.turnOnPrescriptionTemplateEditMode();
        prescriptionStore.setPrescriptionInfomation(
            fullPrescriptionTemplate.value?.prescription as unknown as Info,
            undefined,
            undefined,
        );
    }
}

function onFinishTemplateClickHandler() {
    router.push('/dashboard');
}

onMounted(() => {
    loadTemplate();
});

onBeforeUnmount(() => {
    prescriptionStore.resetPrescription();
});
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#navbar">
                <div class="mr-0 flex w-full max-w-[100rem] items-center justify-between sm:pr-8">
                    <!--Breadcrumbs-->
                    <nav
                        class="flex"
                        aria-label="breadcrumb"
                    >
                        <ol
                            role="list"
                            class="flex items-center space-x-1"
                        >
                            <li>
                                <div class="flex items-center">
                                    <NuxtLink
                                        to="/dashboard"
                                        class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                    >
                                        Dashboard
                                    </NuxtLink>
                                </div>
                            </li>

                            <li>
                                <div class="flex items-center">
                                    <svg
                                        class="h-5 w-5 flex-shrink-0 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <a
                                        href="#"
                                        class="font-poppins-regular text-sm font-medium text-gray-500 hover:text-gray-700 2xl:text-base"
                                        aria-current="page"
                                    >
                                        New Prescription Template
                                    </a>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <!--End--Breadcrumbs-->

                    <div class="col-span-5 bg-white 2xl:col-span-4">
                        <div
                            v-if="isPrescriptionTemplateEditMode"
                            class="flex w-full"
                        >
                            <button
                                class="font-poppins-semibold group inline-flex w-[14rem] items-center justify-center rounded-lg border bg-[#136AFB] px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-skin-button-accent-hover focus:outline-none 2xl:text-base"
                                @click.prevent="onFinishTemplateClickHandler"
                            >
                                <span class="mr-2 h-5 w-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <g
                                            fill="none"
                                            class="stroke-white"
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
                                <span> Finish Template </span>
                            </button>
                        </div>
                    </div>
                </div>
            </Teleport>
        </ClientOnly>

        <div class="mr-0 max-w-[100rem]">
            <div class="flex-col space-y-3 rounded-lg bg-white p-8 shadow">
                <PagesTemplateCreate />

                <section class="relative m-0 flex h-[calc(100%_-_20rem)] flex-1 border-b border-t border-slate-500">
                    <div
                        v-if="!currentPrescriptionTemplate?.prescription_ref"
                        class="absolute inset-0 z-20 cursor-not-allowed bg-black opacity-15"
                        @click="showErrorMessage"
                    ></div>
                    <PrescriptionLeftSide>
                        <ClientOnly>
                            <PrescriptionOptionsChiefComplaints />
                            <PrescriptionOptionsDiagnosis />
                            <PrescriptionOptionsInvestigation />
                        </ClientOnly>
                    </PrescriptionLeftSide>
                    <div class="flex-1 p-6">
                        <ClientOnly>
                            <PrescriptionOptionsDrug />
                            <PrescriptionOptionsAdvice />
                            <PrescriptionOptionsFollowUp />
                        </ClientOnly>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
