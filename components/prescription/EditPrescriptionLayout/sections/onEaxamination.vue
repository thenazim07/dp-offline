<template>
    <div
        ref="reference"
        class="overflow-hidden"
    >
        <div
            id="on_examination"
            :class="
                tailwindMerge(
                    'group flex cursor-pointer flex-col gap-[11px] overflow-hidden p-3 text-[#1E293B] hover:bg-slate-50',
                    {
                        'rounded-lg border border-[#136AFB]': bodysectionModalsEdit.on_examination,
                    },
                )
            "
            :style="generateStyle(on_examination?.styles)"
            @click="bodysectionModalsEdit.on_examination = true"
        >
            <div class="relative flex w-full justify-between">
                <span class="text-sm font-bold">{{ on_examination?.label.text }}</span>
                <PrescriptionEditPrescriptionLayoutNavigationNavArrow
                    v-model:model-value="bodySectionFormData"
                    section-key-name="on_examination"
                />
            </div>

            <span class="text-xs font-bold">G/E</span>
            <!-- list -->
            <div :style="generateStyle(on_examination?.list?.styles)">
                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">Heart Rate: 95 BMP</p>
                                <!-- <p class="text-xs">This is note</p> -->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">
                                    Blood Pressure: 150/110
                                    <!-- <span class="text-sm text-[#64748B]"> (For 1 Days) </span> -->
                                </p>
                                <!-- <p class="text-xs">প্রচন্ড কাপুনি দিয়ে জ্বর আসে আর ঘাম দিয়ে ছাড়ে</p> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <span class="text-xs font-bold">O/E</span>
            <!-- list -->
            <div :style="generateStyle(on_examination?.list?.styles)">
                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">Observation 1</p>
                                <!-- <p class="text-xs">This is note</p> -->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">
                                    Observation 2
                                    <!-- <span class="text-sm text-[#64748B]"> (For 1 Days) </span> -->
                                </p>
                                <!-- <p class="text-xs">প্রচন্ড কাপুনি দিয়ে জ্বর আসে আর ঘাম দিয়ে ছাড়ে</p> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- modal -->
            <PrescriptionEditPrescriptionLayoutModalsLayoutEditModal
                v-if="bodysectionModalsEdit.on_examination"
                ref="floating"
                v-model:model-value="on_examination"
                :style="floatingStyles"
                class="z-50"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

const LayoutsStore = useLayoutsStore();

const { bodySectionFormData, bodysectionModalsEdit } = storeToRefs(LayoutsStore);

const reference = ref(null);
const floating = ref(null);

const currentColumnIndex = computed(() =>
    Object.keys(bodySectionFormData.value.body.columns.column0.items).includes('on_examination') ? 0 : 1,
);

const { floatingStyles } = useFloatingElementPrescriptionLayout(reference, floating, currentColumnIndex);

const { generateStyle } = useGenerateStyle();

onClickOutside(floating, () => (bodysectionModalsEdit.value.on_examination = false));

const on_examination = computed({
    // getter
    get() {
        return (
            bodySectionFormData.value.body.columns.column0.items.on_examination ??
            bodySectionFormData.value.body.columns.column1.items.on_examination
        );
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        if (bodySectionFormData.value.body.columns.column0.items.on_examination)
            bodySectionFormData.value.body.columns.column0.items.on_examination = newValue;

        if (bodySectionFormData.value.body.columns.column1.items.on_examination)
            bodySectionFormData.value.body.columns.column1.items.on_examination = newValue;
    },
});
</script>
