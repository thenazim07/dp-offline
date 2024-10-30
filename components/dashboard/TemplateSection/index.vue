<script lang="ts" setup>
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { useSettingsStore } from '~/stores/settings';
const settingsStore = useSettingsStore();
const prescriptionTemplateStore = usePrescriptionTemplateStore();

const { showViewName } = storeToRefs(settingsStore);

onMounted(async () => {
    await prescriptionTemplateStore.fetchPrescriptionTemplates();
});
</script>

<template>
    <div class="w-full rounded-lg bg-white py-6 shadow">
        <DashboardTemplateSectionSearch />

        <DashboardTemplateSectionTemplateSectionGridView v-show="showViewName === 'grid'" />

        <DashboardTemplateSectionTemplateSectionListView v-show="showViewName === 'list'" />
    </div>
</template>
