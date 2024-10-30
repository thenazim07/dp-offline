<script lang="ts" setup>
import { useOtherHistoryStoreRoot } from '~/stores/ehr/useOtherHistoryRoot';

const otherHistoryStore = useOtherHistoryStoreRoot();

const { immunizationValue, periodValue, note } = storeToRefs(otherHistoryStore);

function periodCreateOrUpdateHandler() {
    otherHistoryStore.periodUpdateOrCreate();
}

function immunizedToggleHandler() {
    otherHistoryStore.immunizedUpdate();
}
</script>

<template>
    <section class="w-full rounded-lg bg-white p-6 max-1919:px-6 max-1919:py-2">
        <PrescriptionEhrOthersSurgicalSection />

        <div class="py-6 max-1919:py-[13px]">
            <hr />
        </div>

        <section>
            <div class="flex items-center">
                <label
                    for="inline-checkbox-for-immunization"
                    class="mr-3 text-base font-bold text-gray-900 dark:text-gray-300"
                >
                    Immunization
                </label>

                <input
                    type="checkbox"
                    id="inline-checkbox-for-immunization"
                    class="h-5 w-5 focus:ring-2 focus:ring-blue-500"
                    v-model="immunizationValue"
                    @change="immunizedToggleHandler"
                />
            </div>
        </section>

        <div class="py-6 max-1919:py-[13px] relative">
            <hr class="absolute w-full" />
        </div>

        <section class="-mt-1">
            <p class="pb-2 text-base font-bold text-gray-900">Period History</p>

            <div class="grid grid-cols-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            id="regular"
                            type="checkbox"
                            :checked="periodValue === 'regular'"
                            true-value="regular"
                            false-value=""
                            class="h-5 w-5 focus:ring-2 focus:ring-blue-500"
                            v-model="periodValue"
                            @change="periodCreateOrUpdateHandler"
                        />
                        <label
                            for="regular"
                            class="ml-2 mr-3 text-sm text-gray-900 dark:text-gray-300"
                        >
                            Regular
                        </label>
                    </div>

                    <div class="flex items-center">
                        <input
                            id="irregular"
                            type="checkbox"
                            :checked="periodValue === 'irregular'"
                            true-value="irregular"
                            false-value=""
                            class="h-5 w-5 focus:ring-2 focus:ring-blue-500"
                            v-model="periodValue"
                            @change="periodCreateOrUpdateHandler"
                        />
                        <label
                            for="irregular"
                            class="font-poppins-regular ml-2 mr-3 text-sm text-gray-900"
                        >
                            Irregular
                        </label>
                    </div>

                    <div class="flex items-center">
                        <input
                            id="menopause"
                            type="checkbox"
                            :checked="periodValue === 'menopause'"
                            true-value="menopause"
                            false-value=""
                            class="h-5 w-5 focus:ring-2 focus:ring-blue-500"
                            v-model="periodValue"
                            @change="periodCreateOrUpdateHandler"
                        />
                        <label
                            for="menopause"
                            class="font-poppins-regular ml-2 mr-3 text-sm text-gray-900 dark:text-gray-300"
                        >
                            Menopause
                        </label>
                    </div>
                </div>

                <div class="mr-3 w-full">
                    <div class="relative">
                        <input
                            id="note"
                            ref="input"
                            v-model="note"
                            type="text"
                            class="input-style peer"
                            placeholder=" "
                            @blur="periodCreateOrUpdateHandler"
                        />
                        <label
                            for="note"
                            class="font-poppins-regular absolute left-2 top-2 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-slate-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2"
                        >
                            Note
                        </label>
                    </div>
                    <VErrorMessage
                        name="contact_no"
                        class="font-poppins-regular text-xs italic text-red-500"
                    >
                    </VErrorMessage>
                </div>
            </div>
        </section>
    </section>
</template>
