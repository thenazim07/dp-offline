<script lang="ts" setup>
import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '@headlessui/vue';
import { TrashIcon, Bars3Icon } from '@heroicons/vue/24/outline';
import { usePrescriptionDrugStore } from '~/stores/prescription/drug';
const { deleteDrug, singleItemUpdate } = usePrescriptionDrugStore();
const { drugSelectionList } = storeToRefs(usePrescriptionDrugStore());
const list = computed(() => {
    if (!drugSelectionList.value) return [];

    return drugSelectionList.value.map((drugItem: any) => ({
        ...drugItem,
        durations: (drugItem.durations || []).map((item: any) => ({
            duration_type: item.type ?? 'days',
            ...item,
        })),
    }));
});

// function convertToObjects(array: any) {
//     return array.map((value: string) => {
//         return {
//             uuid: getUuid(value),
//             value,
//         };
//     });
// }
</script>

<template>
    <ul>
        <li
            v-for="(item, index) in list"
            :key="item.ref"
            class="items-ceter flex w-full border-dashed py-1.5"
            :class="index === 0 ? 'border-b border-t' : 'border-b'"
        >
            <Popover class="w-full xl:max-w-4xl 2xl:max-w-6xl">
                <div class="flex w-full justify-between space-x-2 py-0.5 pr-2 2xl:py-1">
                    <div>
                        <div class="relative w-full">
                            <div class="mb-1">
                                <PopoverButton
                                    class="font-poppins-semibold mr-1 cursor-pointer text-left text-base font-semibold text-slate-900 focus:text-blue-500 focus:outline-none"
                                >
                                    {{ index + 1 }}. {{ item?.dosage_form?.short_name }}

                                    <span class="mx-1">
                                        {{ item?.brand_name ? item?.brand_name : item?.name }}
                                        {{ item.strength }}
                                    </span>
                                    <span
                                        v-if="item.generic_name"
                                        class="text-sm text-gray-600"
                                    >
                                        ({{ item.generic_name }})
                                    </span>
                                </PopoverButton>
                            </div>

                            <div
                                v-if="item.durations"
                                class="block w-full"
                            >
                                <div
                                    v-for="(duration, key) in item.durations"
                                    :key="key"
                                    class="flex"
                                >
                                    <div class="-mb-1 w-96 pr-2">
                                        <p class="inline-block text-justify text-sm font-light text-slate-800">
                                            {{ duration?.frequency?.value ?? duration?.frequency }}
                                            <!-- eslint-disable -->
                                            <template
                                                v-if="
                                                    duration?.frequency?.value ||
                                                    (duration?.frequency && duration.instruction)
                                                "
                                            >
                                                {{ '-' }}
                                            </template>
                                            <!-- eslint-enable -->

                                            <template v-if="duration.instruction">
                                                {{ duration.instruction }}
                                            </template>
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-sm capitalize text-slate-800">
                                            {{ duration?.duration ?? null }} {{ duration?.type ?? null }}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    v-if="item.instructions.length > 0"
                                    class="mt-1.5 rounded-md border border-dashed border-yellow-50 bg-gray-100"
                                >
                                    <p
                                        v-for="(instruction, indexc) in item.instructions"
                                        :key="`x-${indexc}`"
                                        class="mr-1.5 inline-flex pl-1.5 text-sm text-slate-800"
                                    >
                                        {{ typeof instruction === 'object' ? instruction.value : instruction }}
                                        <span v-if="item.instructions.length - 1 !== indexc"> ,</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <PopoverOverlay class="fixed inset-0" />

                    <transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="translate-y-1 opacity-0"
                        enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="translate-y-0 opacity-100"
                        leave-to-class="translate-y-1 opacity-0"
                    >
                        <PopoverPanel
                            class="absolute z-30 w-full max-w-3xl rounded-lg bg-white p-4 shadow-follow-up lg:left-12 xl:left-[35%] xl:mt-6 2xl:left-[31%] 2xl:mt-8 2xl:max-w-5xl"
                        >
                            <NuxtErrorBoundary>
                                <VForm
                                    v-slot="{ values }"
                                    class="w-full cursor-pointer rounded-lg bg-slate-100"
                                    :initial-values="{
                                        ref: item.ref,
                                        brand_name: item?.brand_name ?? '',
                                        generic_ref: item?.generic_ref ?? '',
                                        dosage_form_ref: item?.dosage_form?.ref ?? '',
                                        durations: item?.durations ?? [],
                                        instructions: item.instructions[0] ?? [],
                                    }"
                                    as="div"
                                >
                                    <PrescriptionBaseComponentsItemMedicineMarkup
                                        :drug="item"
                                        @change-value="singleItemUpdate(values)"
                                    >
                                        <template #content>
                                            <div class="flex pt-4">
                                                <div class="flex h-8 w-8 flex-shrink-0 items-center">
                                                    <Bars3Icon class="h-5 w-5 text-slate-300" />
                                                </div>

                                                <div class="w-full">
                                                    <div class="mb-5 w-full">
                                                        <PrescriptionMedicineLeftSideComponentSingleItem
                                                            :field="item"
                                                            @change-value="singleItemUpdate(values)"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </PrescriptionBaseComponentsItemMedicineMarkup>
                                </VForm>
                                <template #error="{ error }">
                                    <p>An error occurred: {{ error }}</p>
                                </template>
                            </NuxtErrorBoundary>
                        </PopoverPanel>
                    </transition>

                    <div>
                        <button @click="deleteDrug(item)">
                            <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
                        </button>
                    </div>
                </div>
            </Popover>
        </li>
    </ul>
</template>
