<script setup lang="ts">
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';

interface Props {
    name: string;
    id: number;
}

const props = withDefaults(defineProps<Props>(), {
    name: 'Template',
});

const router = useRouter();
const { hasSelectedPatient } = managePrescription();
const prescriptionTemplateStore = usePrescriptionTemplateStore();

async function onClickHandler() {
    if (
        hasSelectedPatient.value &&
        !confirm('There is already a prescription is going on. Do you want to replace the existing prescription?')
    ) {
        return;
    }

    await router.push({
        name: 'dashboard-prescription-create',
        query: {
            templateId: props.id,
        },
    });

    prescriptionTemplateStore.resetSearchQuery();
}
</script>

<template>
    <div class="group relative cursor-pointer overflow-hidden rounded-lg border">
        <div
            class="absolute inset-0 flex items-center justify-center bg-gray-900 text-white opacity-60 transition-opacity duration-300 ease-in-out group-hover:opacity-75"
            @click="onClickHandler"
        >
            <p class="text-center text-xl">
                {{ props.name }}
            </p>
        </div>
        <div class="absolute end-1 top-1">
            <span class="text-white">
                <DashboardTemplateSectionVerticalDropdown
                    icon-class="text-white"
                    :prescription-template-id="props.id"
                />
            </span>
        </div>
        <img
            class="h-full w-full object-cover"
            src="~/assets/images/preview/templeate_prescription.svg"
            alt="Template"
        />
    </div>
</template>
