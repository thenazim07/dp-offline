<template>
    <div
        ref="reference"
        class="overflow-hidden"
    >
        <div
            id="diagnosis"
            :class="
                tailwindMerge(
                    'group flex cursor-pointer flex-col gap-[11px] overflow-hidden p-3 text-[#1E293B] hover:bg-slate-50',
                    {
                        'rounded-lg border border-[#136AFB]': bodysectionModalsEdit.diagnosis,
                    },
                )
            "
            :style="generateStyle(diagnosis?.styles)"
            @click="bodysectionModalsEdit.diagnosis = true"
        >
            <div class="relative flex w-full justify-between">
                <span class="text-sm font-bold">{{ diagnosis?.label?.text }}</span>
                <PrescriptionEditPrescriptionLayoutNavigationNavArrow
                    v-model:model-value="bodySectionFormData"
                    section-key-name="diagnosis"
                />
            </div>

            <!-- list -->
            <div :style="generateStyle(diagnosis?.list?.styles)">
                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">Serum creatinine</p>
                                <p class="text-xs">This is note</p>
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
                                    Restless leg syndrome
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
                v-if="bodysectionModalsEdit.diagnosis"
                ref="floating"
                v-model:model-value="diagnosis"
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

const { generateStyle } = useGenerateStyle();

const reference = ref(null);
const floating = ref(null);

const currentColumnIndex = computed(() =>
    Object.keys(bodySectionFormData.value.body.columns.column0.items).includes('diagnosis') ? 0 : 1,
);

const { floatingStyles } = useFloatingElementPrescriptionLayout(reference, floating, currentColumnIndex);

onClickOutside(floating, () => (bodysectionModalsEdit.value.diagnosis = false));

const diagnosis = computed({
    // getter
    get() {
        return (
            bodySectionFormData.value.body.columns.column0.items.diagnosis ??
            bodySectionFormData.value.body.columns.column1.items.diagnosis
        );
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        if (bodySectionFormData.value.body.columns.column0.items.diagnosis)
            bodySectionFormData.value.body.columns.column0.items.diagnosis = newValue;

        if (bodySectionFormData.value.body.columns.column1.items.diagnosis)
            bodySectionFormData.value.body.columns.column1.items.diagnosis = newValue;
    },
});
</script>
