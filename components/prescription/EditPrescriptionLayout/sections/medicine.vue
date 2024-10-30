<template>
    <div
        ref="reference"
        class="overflow-hidden"
    >
        <div
            id="drug"
            :class="
                tailwindMerge(
                    'group flex cursor-pointer flex-col gap-[11px] overflow-hidden p-3 text-[#1E293B] hover:bg-slate-50',
                    {
                        'rounded-lg border border-[#136AFB]': bodysectionModalsEdit.drug,
                    },
                )
            "
            :style="generateStyle(drug?.styles)"
            @click="bodysectionModalsEdit.drug = true"
        >
            <div class="relative flex w-full justify-between text-sm font-bold">
                <img
                    v-if="drug?.label.printable"
                    src="~/assets/images/preview/rx.svg"
                    alt="rx_svg"
                />
                <PrescriptionEditPrescriptionLayoutNavigationNavArrow
                    v-model:model-value="bodySectionFormData"
                    section-key-name="drug"
                />
            </div>

            <!-- list -->
            <div :style="generateStyle(drug?.list?.styles)">
                <div class="flex items-start justify-start gap-3">
                    <div class="w-[1.5%]">
                        <div class="h-1.5 w-1.5 text-sm font-bold">1.</div>
                    </div>

                    <div class="flex flex-grow items-start justify-normal">
                        <div class="flex w-full flex-grow flex-col items-start gap-2">
                            <p class="cursor-pointer text-sm text-[#1E293B]">Tab. apa Extra 500 mg</p>
                            <div class="flex w-full justify-between text-sm">
                                <p class="cursor-pointer text-sm text-[#1E293B]">0+0+1</p>
                                <p class="cursor-pointer text-sm text-[#1E293B]">খাবারপরে, জ্বরআসলেখাবেন</p>
                                <p class="cursor-pointer text-sm text-[#1E293B]">3 Days</p>
                            </div>
                            <!-- <p class="text-xs">This is note</p> -->
                        </div>
                    </div>
                </div>

                <div class="flex items-start justify-start gap-3">
                    <div class="w-[1.5%]">
                        <div class="h-1.5 w-1.5 text-sm font-bold">2.</div>
                    </div>

                    <div class="flex flex-grow items-start justify-normal">
                        <div class="flex w-full flex-grow flex-col items-start gap-2">
                            <p class="cursor-pointer text-sm text-[#1E293B]">Sup. Renova 60 mg</p>
                            <div class="flex w-full justify-between text-sm">
                                <p class="cursor-pointer text-sm text-[#1E293B]">১টি</p>
                                <p class="cursor-pointer text-sm text-[#1E293B]">
                                    কাঠি পায়ু পথে দিবেন যদি জ্বর ১০২ ডিগ্রী এব বেশি থাকে, ৮ ঘন্টাা পর পর
                                </p>
                                <p class="cursor-pointer text-sm text-[#1E293B]">3 Days</p>
                            </div>
                            <p class="text-xs">This is note</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- modal -->
            <PrescriptionEditPrescriptionLayoutModalsLayoutEditDrugModal
                v-if="bodysectionModalsEdit.drug"
                ref="floating"
                v-model:model-value="drug"
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

const { generateStyle } = useGenerateStyle();

const currentColumnIndex = computed(() =>
    Object.keys(bodySectionFormData.value.body.columns.column0.items).includes('drug') ? 0 : 1,
);

const { floatingStyles } = useFloatingElementPrescriptionLayout(reference, floating, currentColumnIndex);

onClickOutside(floating, () => (bodysectionModalsEdit.value.drug = false));

const drug = computed({
    // getter
    get() {
        return (
            bodySectionFormData.value.body.columns.column0.items.drug ??
            bodySectionFormData.value.body.columns.column1.items.drug
        );
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        if (bodySectionFormData.value.body.columns.column0.items.drug)
            bodySectionFormData.value.body.columns.column0.items.drug = newValue;

        if (bodySectionFormData.value.body.columns.column1.items.drug)
            bodySectionFormData.value.body.columns.column1.items.drug = newValue;
    },
});
</script>
