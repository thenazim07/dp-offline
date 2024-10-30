<script setup lang="ts">
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';

const router = useRouter();
const toast = useToast();
const prescriptionTemplateStore = usePrescriptionTemplateStore();

const { storePrescriptionTemplatePayload, isPrescriptionTemplateEditMode, currentPrescriptionTemplate } =
    storeToRefs(prescriptionTemplateStore);

async function onFormSubmitHandler() {
    try {
        if (isPrescriptionTemplateEditMode.value && currentPrescriptionTemplate.value?.id) {
            await prescriptionTemplateStore.updatePrescriptionTemplate(
                storePrescriptionTemplatePayload.value,
                currentPrescriptionTemplate.value?.id,
            );
            toast.add({ title: 'Template information updated successfully.', color: 'green' });

            return;
        }

        await prescriptionTemplateStore.storePrescriptionTemplate(storePrescriptionTemplatePayload.value, true);

        prescriptionTemplateStore.turnOnPrescriptionTemplateEditMode();

        toast.add({ title: 'Template information saved successfully.', color: 'green' });

        router.replace({
            query: {
                templateId: currentPrescriptionTemplate.value?.id,
            },
        });
    } catch (error) {
        console.error(error);
        toast.add({ title: 'Failed to save template information', color: 'red' });
    }
}
</script>

<template>
    <form @submit.prevent="onFormSubmitHandler">
        <div class="grid grid-cols-12 gap-6 xl:col-span-8 2xl:col-span-7">
            <div class="col-span-6">
                <div class="mb-5">
                    <div class="relative">
                        <input
                            id="name"
                            v-model="storePrescriptionTemplatePayload.name"
                            class="font-poppins-regular peer block w-full appearance-none rounded-md border bg-transparent px-3 pb-3 pt-3 text-sm text-gray-900 focus:outline-none focus:ring-0 2xl:text-base"
                            placeholder=" "
                            required
                        />

                        <label
                            for="name"
                            class="font-poppins-regular absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
                        >
                            Template Name
                            <span class="text-rose-500"> * </span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-span-3">
                <div class="mb-5">
                    <div class="relative">
                        <input
                            id="score"
                            v-model="storePrescriptionTemplatePayload.score"
                            class="font-poppins-regular peer block w-full appearance-none rounded-md border bg-transparent px-3 pb-3 pt-3 text-sm text-gray-900 focus:outline-none focus:ring-0 2xl:text-base"
                            placeholder=" "
                            type="number"
                        />

                        <label
                            for="score"
                            class="font-poppins-regular absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
                        >
                            Score
                            <span class="text-rose-500"> * </span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-span-3">
                <div class="mb-5">
                    <button
                        type="submit"
                        class="font-poppins-semibold group inline-flex w-[14rem] items-center justify-center rounded-lg border bg-[#136AFB] px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-skin-button-accent-hover focus:outline-none 2xl:text-base"
                    >
                        <span class="mr-2 h-5 w-5">
                            <IconsSaveIcon />
                        </span>
                        <span v-if="isPrescriptionTemplateEditMode"> Update Template </span>
                        <span v-else> Save Template </span>
                    </button>
                </div>
            </div>
        </div>
    </form>
</template>
