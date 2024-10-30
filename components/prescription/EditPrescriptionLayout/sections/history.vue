<template>
    <div
        ref="reference"
        class="overflow-hidden"
    >
        <div
            id="past_history"
            :class="
                tailwindMerge(
                    'group flex cursor-pointer flex-col gap-[11px] overflow-hidden p-3 text-[#1E293B] hover:bg-slate-50',
                    {
                        'rounded-lg border border-[#136AFB]': bodysectionModalsEdit.past_history,
                    },
                )
            "
            :style="generateStyle(history?.styles)"
            @click="bodysectionModalsEdit.past_history = true"
        >
            <div class="relative flex w-full justify-between">
                <span class="text-sm font-bold">{{ history?.label.text }}</span>
                <PrescriptionEditPrescriptionLayoutNavigationNavArrow
                    v-model:model-value="bodySectionFormData"
                    section-key-name="past_history"
                />
            </div>

            <span class="text-xs font-bold">D/H:</span>
            <!-- list -->
            <div :style="generateStyle(history?.list.styles)">
                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">
                                    Gastric
                                    <span class="text-sm text-[#64748B]"> (For 2 Years) </span>
                                </p>
                                <p class="text-xs">প্রচন্ড কাপুনি দিয়ে জ্বর আসে আর ঘাম দিয়ে ছাড়ে</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <span class="text-xs font-bold">Med/H:</span>
            <!-- list -->
            <div :style="generateStyle(history?.list.styles)">
                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">Tab. Inran 150 mg</p>
                                <p class="text-xs">{{ '০+১+০ - 14 day' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <span class="text-xs font-bold">I/H:</span>
            <!-- list -->
            <div :style="generateStyle(history?.list.styles)">
                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">
                                    Cough and common cold
                                    <span class="text-sm text-[#64748B]"> (04 Sep 2024) </span>
                                </p>
                                <p class="text-xs">This is note</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <span class="text-xs font-bold">F/H:</span>
            <!-- list -->
            <div :style="generateStyle(history?.list.styles)">
                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">
                                    Cholera, unspecified
                                    <span class="text-sm text-[#64748B]"> (husband) </span>
                                </p>
                                <p class="text-xs">This is note</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <span class="text-xs font-bold">L/H:</span>
            <!-- list -->
            <div :style="generateStyle(history?.list.styles)">
                <div class="flex items-center justify-between gap-2">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>

                    <div class="flex flex-grow items-start justify-between">
                        <div class="flex flex-grow items-start gap-2">
                            <div>
                                <p class="cursor-pointer text-sm text-[#1E293B]">
                                    Smoking
                                    <span class="text-sm text-[#64748B]"> (For 2 Years) </span>
                                </p>
                                <p class="text-xs">This is note</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- modal -->
            <PrescriptionEditPrescriptionLayoutModalsLayoutEditModal
                v-if="bodysectionModalsEdit.past_history"
                ref="floating"
                v-model:model-value="history"
                :style="floatingStyles"
                class="z-50"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
const LayoutsStore = useLayoutsStore();

const { bodySectionFormData, bodysectionModalsEdit } = storeToRefs(LayoutsStore);

const reference = ref(null);
const floating = ref(null);

const currentColumnIndex = computed(() =>
    Object.keys(bodySectionFormData.value.body.columns.column0.items).includes('past_history') ? 0 : 1,
);

const { floatingStyles } = useFloatingElementPrescriptionLayout(reference, floating, currentColumnIndex);

const { generateStyle } = useGenerateStyle();

onClickOutside(floating, () => (bodysectionModalsEdit.value.past_history = false));

const history = computed({
    // getter
    get() {
        return (
            bodySectionFormData.value.body.columns.column0.items.past_history ??
            bodySectionFormData.value.body.columns.column1.items.past_history
        );
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        if (bodySectionFormData.value.body.columns.column0.items.past_history)
            bodySectionFormData.value.body.columns.column0.items.past_history = newValue;

        if (bodySectionFormData.value.body.columns.column1.items.past_history)
            bodySectionFormData.value.body.columns.column1.items.past_history = newValue;
    },
});
</script>
