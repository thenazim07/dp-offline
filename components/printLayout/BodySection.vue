<template>
    <ClientOnly>
        <div class="flex gap-[73px]">
            <div class="relative w-1/2">
                <div class="h-[817px] w-full bg-slate-100">
                    <div class="h-full w-full">
                        <div class="flex h-full w-full items-center justify-center border bg-[#f1f5f9]">
                            <div class="relative flex h-[90%] w-[80%] flex-col overflow-hidden bg-transparent">
                                <div class="absolute left-0 right-0 top-[2px] m-auto flex w-[85%] items-center">
                                    <div class="h-[1px] w-1/3 bg-black"></div>
                                    <div class="flex w-1/3 justify-center text-sm">
                                        <p>
                                            Total Width: {{ pageSetupFormData.width }} {{ ' '
                                            }}{{ pageSetupFormData.unit }}
                                        </p>
                                    </div>
                                    <div class="h-[1px] w-1/3 bg-black"></div>
                                </div>
                                <div
                                    class="absolute left-0 top-[93%] flex w-[630px] origin-top-left -rotate-90 items-center justify-center"
                                >
                                    <div class="h-[1px] w-1/3 bg-black"></div>
                                    <div class="flex w-1/3 justify-center text-sm">
                                        <p>
                                            Total Height: {{ pageSetupFormData.height }} {{ ' '
                                            }}{{ pageSetupFormData.unit }}
                                        </p>
                                    </div>
                                    <div class="h-[1px] w-1/3 bg-black"></div>
                                </div>

                                <div class="flex h-full w-full items-center justify-center">
                                    <div
                                        ref="whitePapperRef"
                                        class="relative h-[90%] w-[85%] overflow-hidden bg-white"
                                    >
                                        <div class="left_margin absolute left-0 flex h-full w-fit items-center">
                                            <div
                                                class="flex h-full flex-col items-center justify-center border-r-[1px] border-r-[#64748B] bg-white"
                                                :class="bodySectionFormData.divider_line ? ' ' : 'border-r-transparent'"
                                                :style="{
                                                    width: `${((pageSetupFormData.width * bodySectionFormData?.left_section_width) / 100) * (currentHeightWidthwhitePapper.width / pageSetupFormData.width)}px`,
                                                }"
                                            >
                                                <p class="text-xs font-bold leading-[18px]">Left Section</p>
                                                <p>
                                                    Width:
                                                    {{
                                                        (
                                                            (pageSetupFormData.width *
                                                                bodySectionFormData?.left_section_width) /
                                                            100
                                                        ).toFixed(2)
                                                    }}
                                                    ({{ bodySectionFormData?.left_section_width }}%)
                                                </p>
                                            </div>
                                        </div>
                                        <div class="right_margin absolute right-0 flex h-full w-fit items-center">
                                            <div
                                                class="flex h-full flex-col items-center justify-center border-r-[1px] bg-transparent"
                                                :style="{
                                                    width: `${((pageSetupFormData.width * bodySectionFormData?.right_section_width) / 100) * (currentHeightWidthwhitePapper.width / pageSetupFormData.width)}px`,
                                                }"
                                            >
                                                <p class="text-xs font-bold leading-[18px]">Right Section</p>
                                                <p>
                                                    Width:
                                                    {{
                                                        (
                                                            (pageSetupFormData.width *
                                                                bodySectionFormData?.right_section_width) /
                                                            100
                                                        ).toFixed(2)
                                                    }}
                                                    ({{ bodySectionFormData?.right_section_width }}%)
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            class="bottom_margin absolute bottom-0 flex h-fit w-full flex-col items-center"
                                        >
                                            <div
                                                class="h-[100px] w-full border-t-[1px] border-t-[#64748B] bg-white"
                                                :class="bodySectionFormData.bottom_line ? ' ' : 'border-t-transparent'"
                                                :style="{
                                                    height: `50px`,
                                                }"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-1/2">
                <div class="">
                    <div class="divide-y pb-8">
                        <h2 class="pb-2 text-xl font-[700] leading-[30px]">Body Section</h2>
                        <div class=""></div>
                    </div>

                    <div class="mb-[128px] flex gap-6">
                        <div class="w-1/3">
                            <p>Left Section</p>
                        </div>
                        <div class="flex w-2/3 flex-col gap-6">
                            <div class="w-full">
                                <VueSlider
                                    v-model="bodySectionFormData.left_section_width"
                                    :adsorb="false"
                                    :process-style="{ backgroundColor: '#136AFB' }"
                                    :rail-style="{ backgroundColor: '#E2E8F0' }"
                                    :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
                                    :dot-style="{
                                        borderRadius: '0px',
                                        borderColor: '#F1F5F9',
                                        boxShadowColor: 'transparent',
                                    }"
                                    :marks="[15, 25, 35, 45, 55, 65, 75, 85]"
                                    :min="15"
                                    :max="85"
                                    :step-style="{ display: 'none' }"
                                    :dotSize="20"
                                >
                                </VueSlider>
                            </div>
                        </div>
                    </div>
                    <div class="mb-[128px] flex gap-6">
                        <div class="w-1/3">
                            <p>Right Section</p>
                        </div>
                        <div class="flex w-2/3 flex-col gap-6">
                            <div class="w-full">
                                <VueSlider
                                    v-model="bodySectionFormData.right_section_width"
                                    :adsorb="false"
                                    :process-style="{ backgroundColor: '#136AFB' }"
                                    :rail-style="{ backgroundColor: '#E2E8F0' }"
                                    :tooltip-style="{ backgroundColor: 'black', borderColor: 'black' }"
                                    :dot-style="{
                                        borderRadius: '0px',
                                        borderColor: '#F1F5F9',
                                        boxShadowColor: 'transparent',
                                    }"
                                    :marks="[15, 25, 35, 45, 55, 65, 75, 85]"
                                    :min="15"
                                    :max="85"
                                    :step-style="{ display: 'none' }"
                                    :dotSize="20"
                                >
                                </VueSlider>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-6 border-t-2 border-[#cbd5e1]">
                        <div class="flex w-full justify-start gap-6">
                            <div class="">
                                <div :class="tailwindMerge('mr-6 block w-full flex-shrink-0 px-3  py-3.5')">
                                    <UCheckbox
                                        v-model="bodySectionFormData.divider_line"
                                        color="blue"
                                        label="Separator line between sections"
                                        :ui="{ rounded: 'h-[20px] w-[20px]' }"
                                        :checked="bodySectionFormData.divider_line"
                                        @click="bodySectionFormData.divider_line = !bodySectionFormData.divider_line"
                                    />
                                </div>
                            </div>
                            <div class="">
                                <div :class="tailwindMerge('mr-6 block w-full flex-shrink-0 px-3  py-3.5')">
                                    <UCheckbox
                                        v-model="bodySectionFormData.bottom_line"
                                        color="blue"
                                        label="Bottom line"
                                        :ui="{ rounded: 'h-[20px] w-[20px]', base: 'text-sm' }"
                                        :checked="bodySectionFormData.bottom_line"
                                        @click="bodySectionFormData.bottom_line = !bodySectionFormData.bottom_line"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex w-full justify-between gap-6">
                        <div class="w-2/3"></div>
                        <UButton
                            label="Save"
                            color="blue"
                            size="xl"
                            :ui="{
                                strategy: 'override',
                                color: {
                                    blue: {
                                        solid: 'bg-[#136afb] text-white',
                                    },
                                },
                                padding: {
                                    xl: 'px-0 py-3',
                                },
                                base: 'w-[190px] flex justify-center items-center',
                            }"
                            :loading="loadingOnSave"
                            type="submit"
                            @click="createBodySection"
                        >
                            <template #leading>
                                <LibIconDisk />
                            </template>
                        </UButton>
                    </div>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>
<script setup lang="ts">
import VueSlider from 'vue-slider-component';
import tailwindMerge from '~/utils/tailwindMerge';
import { useLayoutsStore } from '~/stores/useLayoutsStore';

const LayoutsStore = useLayoutsStore();
const toast = useToast();
const loadingOnSave = ref(false);
const whitePapperRef = ref<HTMLDivElement | null>(null);
const currentHeightWidthwhitePapper = ref<{ height: number; width: number }>({ height: 0, width: 0 });

const { pageSetupFormData, bodySectionFormData } = storeToRefs(LayoutsStore);

onMounted(async () => {
    // await LayoutsStore.fetchPageSetup();
    // await LayoutsStore.fetchBodySection();
    window.addEventListener('resize', setWhitePapperHieghtWIdth);
});

onUnmounted(() => {
    window.removeEventListener('resize', setWhitePapperHieghtWIdth);
});

watch(
    () => bodySectionFormData.value.left_section_width,
    () => {
        bodySectionFormData.value.right_section_width = 100 - bodySectionFormData.value.left_section_width;
    },
);

watch(
    () => bodySectionFormData.value.right_section_width,
    () => {
        bodySectionFormData.value.left_section_width = 100 - bodySectionFormData.value.right_section_width;
    },
);

watch(
    () => whitePapperRef?.value,
    (element, prevElement) => {
        if (element) {
            setWhitePapperHieghtWIdth();
            window.addEventListener('resize', setWhitePapperHieghtWIdth);
        }
    },
);

const createBodySection = async () => {
    loadingOnSave.value = true;
    await LayoutsStore.createBodySection();
    toast.add({ title: 'Body Section Created Successfully', color: 'green' });
    loadingOnSave.value = false;
};

function setWhitePapperHieghtWIdth() {
    if (whitePapperRef?.value) {
        currentHeightWidthwhitePapper.value.height = whitePapperRef?.value?.clientHeight;
        currentHeightWidthwhitePapper.value.width = whitePapperRef?.value?.clientWidth;
    }
}
</script>
