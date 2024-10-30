<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import type { IPrescriptionTemplate } from '~/repository/modules/PrescriptionTemplateModule/types';
import { usePrescriptionTemplateStore } from '~/stores/prescription-template/usePrescriptionTemplateStore';
import { useSettingsStore } from '~/stores/settings';
const route = useRoute();

const loading: Ref<boolean> = ref(false);
const query: Ref<any> = ref('');

const searchContainer = ref(null);

const settingsStore = useSettingsStore();
const prescriptionTemplateStore = usePrescriptionTemplateStore();

const { showViewName } = storeToRefs(settingsStore);
const { prescriptionTemplates, showTemplateListView, searchQuery } = storeToRefs(prescriptionTemplateStore);

const allTemplates = ref<IPrescriptionTemplate[]>([]);

onMounted(async () => {
    await prescriptionTemplateStore.fetchPrescriptionTemplates();
    allTemplates.value = [...prescriptionTemplates.value];
});

const searchTemplates = useDebounceFn((query: string) => {
    if (query.trim().length === 0) {
        prescriptionTemplates.value = allTemplates.value;
        return true;
    }
    loading.value = true;
    prescriptionTemplates.value = prescriptionTemplates.value.filter((template) =>
        template.name.toLowerCase().includes(query.toLowerCase()),
    );
    loading.value = false;
}, 300);

onClickOutside(searchContainer, () => (showTemplateListView.value = false));
</script>

<template>
    <section
        ref="searchContainer"
        class="py-6"
    >
        <div class="grid h-11 grid-cols-12 gap-8 2xl:h-12">
            <div class="col-span-12 flex items-center">
                <div class="flex-1">
                    <div>
                        <div class="relative">
                            <div class="relative w-full cursor-default overflow-hidden">
                                <div class="w-full">
                                    <input
                                        v-model="searchQuery"
                                        placeholder="Search prescription templates"
                                        class="font-poppins-regular block h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 leading-5 text-slate-500 placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm 2xl:h-12"
                                        @click="showTemplateListView = true"
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
                            >
                                <template v-if="showTemplateListView">
                                    <div class="col-span-12">
                                        <div
                                            class="mr-1 max-h-[280px] overflow-y-auto py-3 pt-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-slate-300 scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
                                        >
                                            <ul class="px-3 2xl:space-y-2 2xl:px-5 2xl:py-3">
                                                <DashboardTemplateSectionTemplateSectionListView />
                                            </ul>
                                        </div>
                                    </div>
                                </template>

                                <div
                                    v-if="prescriptionTemplates.length == 0 && showTemplateListView"
                                    class="col-span-12 flex h-[280px] w-full items-center justify-center"
                                >
                                    <div>
                                        <p class="text-center text-xl font-semibold text-slate-900">
                                            No Template Found
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
