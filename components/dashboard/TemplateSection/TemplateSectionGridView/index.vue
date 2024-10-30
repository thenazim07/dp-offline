<script lang="ts" setup>
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';

const prescriptionTemplateStore = usePrescriptionTemplateStore();

const { filteredPrescriptionTemplates, isTemplateLoading } = storeToRefs(prescriptionTemplateStore);
</script>

<template>
    <div class="flex flex-wrap gap-3 px-6">
        <NuxtLink
            to="/dashboard/template/create"
            class="group flex aspect-square h-[148px] w-[150px] items-center justify-center overflow-hidden rounded-lg border transition-all duration-300 ease-in-out hover:border-blue-500"
        >
            <div>
                <div class="mb-2">
                    <LibIconRx class="mx-auto h-8 w-8 2xl:h-10 2xl:w-10"></LibIconRx>
                </div>
                <p
                    class="text-center text-base font-bold leading-5 text-slate-800 transition-all duration-300 ease-in-out group-hover:text-blue-500"
                >
                    Create <br />
                    New Template
                </p>
            </div>
        </NuxtLink>

        <!-- prescriptionTemplates -->
        <DashboardTemplateSectionTemplateSectionGridViewItem
            v-for="template in filteredPrescriptionTemplates"
            :id="template.id"
            :key="template.id"
            :name="template.name"
        />

        <!-- template loader skeleton -->
        <div
            v-if="isTemplateLoading"
            class="w-[148px] max-w-sm rounded-md border border-slate-600 p-4 shadow"
        >
            <div class="flex animate-pulse space-x-4">
                <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 rounded bg-slate-700"></div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                            <div class="col-span-2 h-2 rounded bg-slate-700"></div>
                            <div class="col-span-1 h-2 rounded bg-slate-700"></div>
                            <div class="col-span-1 h-2 rounded bg-slate-700"></div>
                            <div class="col-span-1 h-2 rounded bg-slate-700"></div>
                        </div>
                        <div class="h-2 rounded bg-slate-700"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
