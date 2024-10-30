<script setup>
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore.ts';
const toast = useToast();

defineProps({
    hasSelectedPatient: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const formData = ref({
    name: '',
    description: '',
    score: '',
});

const PrescriptionTemplateStore = usePrescriptionTemplateStore();
const { storePrescriptionTemplatePayload } = storeToRefs(PrescriptionTemplateStore);
const reference = ref(null);
const floating = ref(null);
const isShowingSaveAsTemplate = ref(false);
const { floatingStyles } = useFloatingElement(reference, floating, { placement: 'bottom' });

onClickOutside(floating, () => (isShowingSaveAsTemplate.value = false));

const StorePrescriptionSaveAsTemplate = () => {
    PrescriptionTemplateStore.createPrescriptionSaveAsTemplate().then((res) => {
        isShowingSaveAsTemplate.value = false;
        toast.add({ title: 'Saved as prescription template successfully', color: 'green' });
    });
};
</script>

<template>
    <ClientOnly>
        <button
            v-if="hasSelectedPatient"
            ref="reference"
            :disabled="loading"
            class="font-poppins-semibold group mr-2 inline-flex w-full max-w-xs items-center justify-center rounded-md border border-[#136AFB] bg-white px-4 py-2.5 text-center text-sm font-semibold text-skin-base shadow-sm hover:bg-skin-button-accent-hover hover:text-white focus:outline-none 2xl:mr-4 2xl:text-base"
            @click="isShowingSaveAsTemplate = !isShowingSaveAsTemplate"
        >
            <span
                v-if="!loading"
                class="mr-2 h-6 w-6"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <g
                        class="stroke-[#136afb] group-hover:stroke-white"
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
            <span>{{ loading ? 'Processing...' : 'Save as Template' }} </span>
        </button>
        <div
            v-if="isShowingSaveAsTemplate"
            ref="floating"
            class="z-10 min-h-[100px] w-[800px]"
            :style="floatingStyles"
        >
            <div
                ref="container"
                class="z-10 rounded-lg bg-slate-200 p-4"
            >
                <div>
                    <PrescriptionCommonPrescriptionSectionTitle
                        title="Save As Template"
                        :show-icon="false"
                    />
                </div>

                <div class="mt-3 flex-col space-y-3 rounded-lg bg-white p-8 shadow">
                    <form
                        autocomplete="false"
                        @submit.prevent="StorePrescriptionSaveAsTemplate"
                    >
                        <div class="grid grid-cols-12 gap-6 xl:col-span-8 2xl:col-span-7">
                            <div class="col-span-4">
                                <div class="mb-5">
                                    <PrescriptionGeneralInput
                                        v-model="storePrescriptionTemplatePayload.name"
                                        name="contact"
                                        :is-required="true"
                                        label="Template Name"
                                        type="contact"
                                    ></PrescriptionGeneralInput>
                                </div>
                            </div>
                            <div class="col-span-4">
                                <div class="mb-5">
                                    <PrescriptionGeneralInput
                                        v-model="storePrescriptionTemplatePayload.score"
                                        name="contact"
                                        label="Score"
                                        type="number"
                                        :is-required="true"
                                    ></PrescriptionGeneralInput>
                                </div>
                            </div>
                            <div class="col-span-4">
                                <div class="mb-5">
                                    <LibButtonsPrimaryButton class-name="p-4 text-lg">Submit</LibButtonsPrimaryButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>
<style lang=""></style>
