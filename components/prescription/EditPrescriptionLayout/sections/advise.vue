<template>
    <div
        ref="reference"
        class="overflow-hidden"
    >
        <div
            id="advise"
            :class="
                tailwindMerge(
                    'group flex cursor-pointer flex-col gap-[11px] overflow-hidden p-3 text-[#1E293B] hover:bg-slate-50',
                    {
                        'rounded-lg border border-[#136AFB]': bodysectionModalsEdit.advise,
                    },
                )
            "
            :style="generateStyle(advise?.styles)"
            @click="bodysectionModalsEdit.advise = true"
        >
            <div class="relative flex w-full justify-between">
                <span class="text-sm font-bold">{{ advise?.label?.text }}:</span>
                <PrescriptionEditPrescriptionLayoutNavigationNavArrow
                    v-model:model-value="bodySectionFormData"
                    section-key-name="advise"
                />
            </div>

            <!-- list -->
            <div
                class="flex items-center justify-between gap-2"
                :style="generateStyle(advise?.list?.styles)"
            >
                <div class="w-[1.5%]">
                    <div class="h-1.5 w-1.5 rounded-full bg-[#1E293B]"></div>
                </div>

                <div class="flex items-start justify-between">
                    <div class="flex flex-grow items-start gap-2">
                        <div>
                            <p class="cursor-pointer text-sm text-[#1E293B]">
                                Advise List: In publishing and graphic design, Lorem ipsum is a placeholder text
                                commonly used to demonstrate the visual form of a document or a typeface without relying
                                on meaningful content.
                            </p>
                            <!-- <p class="text-xs">This is note</p> -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- modal -->
            <PrescriptionEditPrescriptionLayoutModalsLayoutEditModal
                v-if="bodysectionModalsEdit.advise"
                ref="floating"
                v-model:model-value="advise"
                :style="floatingStyles"
                class="z-50"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { autoPlacement } from '@floating-ui/vue';

const LayoutsStore = useLayoutsStore();

const { bodySectionFormData, bodysectionModalsEdit } = storeToRefs(LayoutsStore);

const { generateStyle } = useGenerateStyle();

const reference = ref(null);
const floating = ref(null);

const currentColumnIndex = computed(() =>
    Object.keys(bodySectionFormData.value.body.columns.column0.items).includes('advise') ? 0 : 1,
);

const { floatingStyles } = useFloatingElementPrescriptionLayout(reference, floating, currentColumnIndex);

onClickOutside(floating, () => (bodysectionModalsEdit.value.advise = false));

const advise = computed({
    // getter
    get() {
        return (
            bodySectionFormData.value.body.columns.column0.items.advise ??
            bodySectionFormData.value.body.columns.column1.items.advise
        );
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        if (bodySectionFormData.value.body.columns.column0.items.advise)
            bodySectionFormData.value.body.columns.column0.items.advise = newValue;

        if (bodySectionFormData.value.body.columns.column1.items.advise)
            bodySectionFormData.value.body.columns.column1.items.advise = newValue;
    },
});
</script>
