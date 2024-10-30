<template>
    <div
        ref="reference"
        class="overflow-hidden"
    >
        <div
            id="follow_up"
            :class="
                tailwindMerge(
                    'group flex cursor-pointer flex-col gap-[11px] overflow-hidden p-3 text-[#1E293B] hover:bg-slate-50',
                    {
                        'rounded-lg border border-[#136AFB]': bodysectionModalsEdit.follow_up,
                    },
                )
            "
            :style="generateStyle(follow_up?.styles)"
            @click="bodysectionModalsEdit.follow_up = true"
        >
            <div class="relative flex w-full justify-between">
                <span class="text-sm font-bold">{{ follow_up?.label.text }}:</span>
                <PrescriptionEditPrescriptionLayoutNavigationNavArrow
                    v-model:model-value="bodySectionFormData"
                    section-key-name="follow_up"
                />
            </div>

            <!-- list -->
            <div
                class="flex items-center justify-start gap-2"
                :style="generateStyle(follow_up?.list?.styles)"
            >
                <!-- <div class="w-[1.5%]">
                <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>
            </div> -->

                <div class="flex items-start justify-start">
                    <div class="flex flex-grow items-start gap-2">
                        <div>
                            <p class="cursor-pointer text-sm text-[#1E293B]">Within 2 weeks</p>
                            <!-- <p class="text-xs">This is note</p> -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- modal -->
            <PrescriptionEditPrescriptionLayoutModalsLayoutEditModal
                v-if="bodysectionModalsEdit.follow_up"
                ref="floating"
                v-model:model-value="follow_up"
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
    Object.keys(bodySectionFormData.value.body.columns.column0.items).includes('follow_up') ? 0 : 1,
);

const { floatingStyles } = useFloatingElementPrescriptionLayout(reference, floating, currentColumnIndex);

const { generateStyle } = useGenerateStyle();

onClickOutside(floating, () => (bodysectionModalsEdit.value.follow_up = false));

const follow_up = computed({
    // getter
    get() {
        return (
            bodySectionFormData.value.body.columns.column0.items.follow_up ??
            bodySectionFormData.value.body.columns.column1.items.follow_up
        );
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        if (bodySectionFormData.value.body.columns.column0.items.follow_up)
            bodySectionFormData.value.body.columns.column0.items.follow_up = newValue;

        if (bodySectionFormData.value.body.columns.column1.items.follow_up)
            bodySectionFormData.value.body.columns.column1.items.follow_up = newValue;
    },
});
</script>
