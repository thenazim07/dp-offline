<script setup>
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';

const prescriptionTemplateStore = usePrescriptionTemplateStore();

const { filteredPrescriptionTemplates, showTemplateListView } = storeToRefs(prescriptionTemplateStore);
const templateThumbnailColors = ['bg-[#59D4C9]', 'bg-[#E95EB7]', 'bg-[#FED339]', 'bg-[#A371FC]'];
</script>

<template>
    <section>
        <NuxtLink
            to="/dashboard/template/create"
            class="flex items-center px-6 py-3 text-base font-medium text-slate-800 hover:bg-slate-100"
            @click="showTemplateListView = false"
        >
            <LazyLibIconRx class="mr-3 h-6 w-6" />
            <span>Create New Template</span>
        </NuxtLink>

        <DashboardTemplateSectionTemplateSectionListViewItem
            v-for="(template, templateIndex) in filteredPrescriptionTemplates"
            :id="template.id"
            :key="template.id"
            :color="templateThumbnailColors[templateIndex % templateThumbnailColors.length]"
            :name="template.name"
        />
    </section>
</template>
