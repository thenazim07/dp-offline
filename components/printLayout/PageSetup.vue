<template>
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
                                        Total Width: {{ pageSetupFormData.width }} {{ ' ' }}{{ pageSetupFormData.unit }}
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
                                            class="h-full w-[100px] border-r-[1px] border-dotted bg-transparent"
                                            :class="activeMargin.left ? 'border-[#136afb]' : 'border-[#cbd5e1]'"
                                            :style="{
                                                width: `${pageSetupFormData?.margins?.left * (currentHeightWidthwhitePapper?.width / pageSetupFormData?.width)}px`,
                                            }"
                                        ></div>
                                        <div
                                            class="flex h-9 w-[52px] items-center justify-center rounded-md text-sm text-white"
                                            :class="activeMargin.left ? 'bg-[#136afb]' : 'bg-[#cbd5e1]'"
                                        >
                                            {{ pageSetupFormData?.margins?.left }}
                                        </div>
                                    </div>
                                    <div class="top_margin absolute top-0 flex h-fit w-full flex-col items-center">
                                        <div
                                            class="h-[100px] w-full border-b-[1px] border-dotted bg-transparent"
                                            :class="activeMargin.top ? 'border-[#136afb]' : 'border-[#cbd5e1]'"
                                            :style="{
                                                height: `${pageSetupFormData?.margins?.top * (currentHeightWidthwhitePapper?.height / pageSetupFormData?.height)}px`,
                                            }"
                                        >
                                            <img
                                                v-if="pageSetupFormData.page_type == 'prescriptions_pad'"
                                                class="h-full w-full object-fill"
                                                src="/assets/images/background/SkeletonHeaderPageSetup.png"
                                                :style="{
                                                    paddingLeft: `${pageSetupFormData?.margins?.left * (currentHeightWidthwhitePapper?.width / pageSetupFormData?.width)}px`,
                                                    paddingRight: `${pageSetupFormData?.margins?.right * (currentHeightWidthwhitePapper?.width / pageSetupFormData?.width)}px`,
                                                }"
                                            />
                                        </div>
                                        <div
                                            class="flex h-9 w-[52px] items-center justify-center rounded-md text-sm text-white"
                                            :class="activeMargin.top ? 'bg-[#136afb]' : 'bg-[#cbd5e1]'"
                                        >
                                            {{ pageSetupFormData?.margins?.top }}
                                        </div>
                                    </div>
                                    <div class="right_margin absolute right-0 flex h-full w-fit items-center">
                                        <div
                                            class="flex h-9 w-[52px] items-center justify-center rounded-md text-sm text-white"
                                            :class="activeMargin.right ? 'bg-[#136afb]' : 'bg-[#cbd5e1]'"
                                        >
                                            {{ pageSetupFormData?.margins?.right }}
                                        </div>
                                        <div
                                            class="h-full w-[100px] border-l-[1px] border-dotted bg-transparent"
                                            :class="activeMargin.right ? 'border-[#136afb]' : 'border-[#cbd5e1]'"
                                            :style="{
                                                width: `${pageSetupFormData?.margins?.right * (currentHeightWidthwhitePapper?.width / pageSetupFormData?.width)}px`,
                                            }"
                                        ></div>
                                    </div>
                                    <div
                                        class="bottom_margin absolute bottom-0 flex h-fit w-full flex-col items-center"
                                    >
                                        <div
                                            class="flex h-9 w-[52px] items-center justify-center rounded-md text-sm text-white"
                                            :class="activeMargin.bottom ? 'bg-[#136afb]' : 'bg-[#cbd5e1]'"
                                        >
                                            {{ pageSetupFormData?.margins?.bottom }}
                                        </div>
                                        <div
                                            class="h-[100px] w-full border-t-[1px] border-dotted bg-transparent"
                                            :class="activeMargin.bottom ? 'border-[#136afb]' : 'border-[#cbd5e1]'"
                                            :style="{
                                                height: `${pageSetupFormData?.margins?.bottom * (currentHeightWidthwhitePapper.height / pageSetupFormData?.height)}px`,
                                            }"
                                        >
                                            <img
                                                v-if="pageSetupFormData.page_type == 'prescriptions_pad'"
                                                class="h-full w-full object-fill"
                                                src="/assets/images/background/SkeletonFooterPageSetup.png"
                                                :style="{
                                                    paddingLeft: `${pageSetupFormData?.margins?.left * (currentHeightWidthwhitePapper?.width / pageSetupFormData?.width)}px`,
                                                    paddingRight: `${pageSetupFormData?.margins?.right * (currentHeightWidthwhitePapper?.width / pageSetupFormData?.width)}px`,
                                                }"
                                            />
                                        </div>
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
                    <h2 class="pb-2 text-xl font-[700] leading-[30px]">Page Setup</h2>
                    <div class=""></div>
                </div>

                <div class="mb-[56px] flex gap-6">
                    <div class="w-1/3">
                        <p>Page Type</p>
                    </div>
                    <div class="flex w-2/3 gap-6">
                        <div class="h-full w-1/2">
                            <div
                                :class="
                                    tailwindMerge(
                                        'mr-6 block w-full flex-shrink-0 rounded-md border border-slate-200 px-3  py-3.5',
                                        { 'border-blue-600': pageSetupFormData.page_type == 'blank_page' },
                                    )
                                "
                            >
                                <!-- v-model="" -->
                                <!-- :name="column.label"
                                :checked="column.checked" -->
                                <UCheckbox
                                    v-model="isTypeBlank"
                                    color="blue"
                                    label="Blank Page"
                                    :ui="{ rounded: 'rounded-full h-[18px] w-[18px]' }"
                                    :checked="pageSetupFormData.page_type == 'blank_page'"
                                />
                            </div>
                        </div>
                        <div class="h-full w-1/2">
                            <div
                                :class="
                                    tailwindMerge(
                                        'mr-6 block w-full flex-shrink-0 rounded-md border border-slate-200 px-3  py-3.5',
                                        { 'border-blue-600': pageSetupFormData.page_type == 'prescriptions_pad' },
                                    )
                                "
                            >
                                <!-- v-model="" -->
                                <!-- :name="column.label"
                                :checked="column.checked" -->
                                <UCheckbox
                                    v-model="isPrescriptionPad"
                                    color="blue"
                                    label="Prescription Pad"
                                    :ui="{ rounded: 'rounded-full h-[18px] w-[18px]', base: 'text-sm' }"
                                    :checked="pageSetupFormData.page_type == 'prescriptions_pad'"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-[128px] flex gap-6">
                    <div class="w-1/3">
                        <p>Page Size</p>
                    </div>
                    <div class="flex w-2/3 flex-col gap-6">
                        <div class="w-full">
                            <!-- v-model="" -->
                            <!-- :name="column.label"
                                :checked="column.checked" -->
                            <USelectMenu
                                v-model="pageSetupFormData.page_size"
                                :options="fields?.page_sizes ?? []"
                                option-attribute="name"
                                value-attribute="value"
                                :ui="{ base: 'h-[48px]' }"
                                @change="OnPageSizeChange"
                            />
                        </div>
                        <div
                            v-if="pageSetupFormData.page_size == 'custom'"
                            class="flex w-full gap-6"
                        >
                            <div class="w-1/2">
                                <label>Total Height</label>
                                <div class="relative flex w-full">
                                    <UInput
                                        v-model="pageSetupFormData.height"
                                        type="number"
                                        :step="0.1"
                                        class="w-full"
                                        :ui="{ base: 'h-[48px]   ' }"
                                    />
                                    <USelectMenu
                                        v-model="pageSetupFormData.unit"
                                        :options="fields?.units ?? []"
                                        option-attribute="name"
                                        value-attribute="value"
                                        variant="none"
                                        class="absolute bottom-0 right-0 border-l-0 outline-none"
                                        :ui="{
                                            base: 'h-[48px]',
                                        }"
                                    />
                                </div>
                            </div>
                            <div class="w-1/2">
                                <label>Total Width</label>
                                <div class="relative flex w-full">
                                    <UInput
                                        v-model="pageSetupFormData.width"
                                        type="number"
                                        :step="0.1"
                                        class="w-full"
                                        :ui="{ base: 'h-[48px]   ' }"
                                    />
                                    <USelectMenu
                                        v-model="pageSetupFormData.unit"
                                        :options="fields?.units ?? []"
                                        option-attribute="name"
                                        value-attribute="value"
                                        variant="none"
                                        class="absolute bottom-0 right-0 border-l-0 outline-none"
                                        :ui="{
                                            base: 'h-[48px]',
                                        }"
                                        :popper="{
                                            strategy: 'absolute',
                                        }"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-20 flex gap-6">
                    <div class="w-1/3">
                        <p>Page Margins</p>
                    </div>
                    <div class="flex w-2/3 flex-col gap-6">
                        <div class="w-full">
                            <USelectMenu
                                v-model="pageSetupFormData.margins.type"
                                :options="Object.keys(fields?.page_margins || {}) ?? []"
                                :ui="{ base: 'h-[48px]' }"
                                @change="OnPageMarginChange"
                            />
                        </div>
                        <div
                            v-if="pageSetupFormData.page_type == 'prescriptions_pad'"
                            class="flex w-full gap-6"
                        >
                            <div class="w-1/2">
                                <label>Pad header</label>
                                <div class="relative flex w-full">
                                    <UInput
                                        v-model="pageSetupFormData.margins.top"
                                        type="number"
                                        :step="0.1"
                                        class="w-full"
                                        :ui="{ base: 'h-[48px]   ' }"
                                        @focus="activeMargin.top = true"
                                        @blur="activeMargin.top = false"
                                    />
                                    <USelectMenu
                                        v-model="pageSetupFormData.margins.unit"
                                        :options="fields?.units ?? []"
                                        option-attribute="name"
                                        value-attribute="value"
                                        variant="none"
                                        class="absolute bottom-0 right-0 border-l-0 outline-none"
                                        :ui="{
                                            base: 'h-[48px]',
                                        }"
                                        :popper="{
                                            strategy: 'absolute',
                                        }"
                                    />
                                </div>
                            </div>
                            <div class="w-1/2">
                                <label>Pad footer</label>
                                <div class="relative flex w-full">
                                    <UInput
                                        v-model="pageSetupFormData.margins.bottom"
                                        type="number"
                                        :step="0.1"
                                        class="w-full"
                                        :ui="{ base: 'h-[48px]   ' }"
                                        @focus="activeMargin.bottom = true"
                                        @blur="activeMargin.bottom = false"
                                    />
                                    <USelectMenu
                                        v-model="pageSetupFormData.margins.unit"
                                        :options="fields?.units ?? []"
                                        option-attribute="name"
                                        value-attribute="value"
                                        variant="none"
                                        class="absolute bottom-0 right-0 border-l-0 outline-none"
                                        :ui="{
                                            base: 'h-[48px]',
                                        }"
                                        :popper="{
                                            strategy: 'absolute',
                                        }"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="flex w-full gap-6">
                            <div class="w-1/2">
                                <label>Left</label>
                                <div class="relative flex w-full">
                                    <UInput
                                        v-model="pageSetupFormData.margins.left"
                                        type="number"
                                        :step="0.1"
                                        class="w-full"
                                        :ui="{ base: 'h-[48px]   ' }"
                                        @focus="activeMargin.left = true"
                                        @blur="activeMargin.left = false"
                                    />
                                    <USelectMenu
                                        v-model="pageSetupFormData.margins.unit"
                                        :options="fields?.units ?? []"
                                        option-attribute="name"
                                        value-attribute="value"
                                        variant="none"
                                        class="absolute bottom-0 right-0 border-l-0 outline-none"
                                        :ui="{
                                            base: 'h-[48px]',
                                        }"
                                        :popper="{
                                            strategy: 'absolute',
                                        }"
                                    />
                                </div>
                            </div>
                            <div class="w-1/2">
                                <label>Right</label>
                                <div class="relative flex w-full">
                                    <UInput
                                        v-model="pageSetupFormData.margins.right"
                                        type="number"
                                        :step="0.1"
                                        class="w-full"
                                        :ui="{ base: 'h-[48px]   ' }"
                                        @focus="activeMargin.right = true"
                                        @blur="activeMargin.right = false"
                                    />
                                    <USelectMenu
                                        v-model="pageSetupFormData.margins.unit"
                                        :options="fields?.units ?? []"
                                        option-attribute="name"
                                        value-attribute="value"
                                        variant="none"
                                        class="absolute bottom-0 right-0 border-l-0 outline-none"
                                        :ui="{
                                            base: 'h-[48px]',
                                        }"
                                        :popper="{
                                            strategy: 'absolute',
                                        }"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="pageSetupFormData.page_type == 'blank_page'"
                            class="flex w-full gap-6"
                        >
                            <div class="w-1/2">
                                <label>Top</label>
                                <div class="relative flex w-full">
                                    <UInput
                                        v-model="pageSetupFormData.margins.top"
                                        type="number"
                                        :step="0.1"
                                        class="w-full"
                                        :ui="{ base: 'h-[48px]   ' }"
                                        @focus="activeMargin.top = true"
                                        @blur="activeMargin.top = false"
                                    />
                                    <USelectMenu
                                        v-model="pageSetupFormData.margins.unit"
                                        :options="fields?.units ?? []"
                                        option-attribute="name"
                                        value-attribute="value"
                                        variant="none"
                                        class="absolute bottom-0 right-0 border-l-0 outline-none"
                                        :ui="{
                                            base: 'h-[48px]',
                                        }"
                                        :popper="{
                                            strategy: 'absolute',
                                        }"
                                    />
                                </div>
                            </div>
                            <div class="w-1/2">
                                <label>Bottom</label>
                                <div class="relative flex w-full">
                                    <UInput
                                        v-model="pageSetupFormData.margins.bottom"
                                        type="number"
                                        :step="0.1"
                                        class="w-full"
                                        :ui="{ base: 'h-[48px]   ' }"
                                        @focus="activeMargin.bottom = true"
                                        @blur="activeMargin.bottom = false"
                                    />
                                    <USelectMenu
                                        v-model="pageSetupFormData.margins.unit"
                                        :options="fields?.units ?? []"
                                        option-attribute="name"
                                        value-attribute="value"
                                        variant="none"
                                        class="absolute bottom-0 right-0 border-l-0 outline-none"
                                        :ui="{
                                            base: 'h-[48px]',
                                        }"
                                        :popper="{
                                            strategy: 'absolute',
                                        }"
                                    />
                                </div>
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
                        @click="createPageSetup"
                    >
                        <template #leading>
                            <LibIconDisk />
                        </template>
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import tailwindMerge from '~/utils/tailwindMerge';
import { useConfigsStore } from '~/stores/useConfigsStore';
import { useLayoutsStore } from '~/stores/useLayoutsStore';

const { fields } = useConfigsStore();
const LayoutsStore = useLayoutsStore();
const toast = useToast();
const loadingOnSave = ref(false);
const whitePapperRef = ref<HTMLDivElement | null>(null);
const currentHeightWidthwhitePapper = ref<{ height: number; width: number }>({ height: 0, width: 0 });

const { pageSetupFormData } = storeToRefs(LayoutsStore);

const activeMargin = ref({
    left: false,
    right: false,
    top: false,
    bottom: false,
});

const OnPageSizeChange = () => {
    // pageSetupFormData.value.height = fields?.page_sizes[pageSetupFormData.value.page_size].height;
    // pageSetupFormData.value.width = fields?.page_sizes[pageSetupFormData.value.page_size].width;
    // pageSetupFormData.value.unit = fields?.page_sizes[pageSetupFormData.value.page_size].unit;
    const selectedPageSizeDimension = fields?.page_sizes?.find(
        (pageSize: any) => pageSize.value === pageSetupFormData.value.page_size,
    )?.dimension;

    console.log('dimensions ', selectedPageSizeDimension);

    if (selectedPageSizeDimension) {
        pageSetupFormData.value.height = selectedPageSizeDimension?.height;
        pageSetupFormData.value.width = selectedPageSizeDimension?.width;
        pageSetupFormData.value.unit = selectedPageSizeDimension?.unit;
    }
};

const OnPageMarginChange = () => {
    pageSetupFormData.value.margins.left = fields?.page_margins[pageSetupFormData.value.margins.type]?.left;
    pageSetupFormData.value.margins.right = fields?.page_margins[pageSetupFormData.value.margins.type]?.right;
    pageSetupFormData.value.margins.top = fields?.page_margins[pageSetupFormData.value.margins.type]?.top;
    pageSetupFormData.value.margins.bottom = fields?.page_margins[pageSetupFormData.value.margins.type]?.bottom;
    pageSetupFormData.value.margins.unit = fields?.page_margins[pageSetupFormData.value.margins.type]?.unit;
};

onMounted(async () => {
    await LayoutsStore.fetchPageSetup();

    if (whitePapperRef?.value) {
        setWhitePapperHieghtWIdth();
        window.addEventListener('resize', setWhitePapperHieghtWIdth);
    }
});

onUnmounted(() => {
    window.addEventListener('resize', setWhitePapperHieghtWIdth);
});

const isTypeBlank = computed({
    get: () => {
        return pageSetupFormData.value.page_type == 'blank_page' ? true : false;
    },
    set: (value) => {
        pageSetupFormData.value.page_type = 'blank_page';
    },
});

const isPrescriptionPad = computed({
    get: () => {
        return pageSetupFormData.value.page_type == 'prescriptions_pad' ? true : false;
    },
    set: (value) => {
        pageSetupFormData.value.page_type = 'prescriptions_pad';
    },
});

const createPageSetup = async () => {
    loadingOnSave.value = true;
    await LayoutsStore.createPageSetup();
    toast.add({ title: 'Page Setup Created Successfully', color: 'green' });
    loadingOnSave.value = false;
};

const setWhitePapperHieghtWIdth = () => {
    if (whitePapperRef?.value) {
        currentHeightWidthwhitePapper.value.height = whitePapperRef?.value?.clientHeight;
        currentHeightWidthwhitePapper.value.width = whitePapperRef?.value?.clientWidth;
    }
};
</script>
