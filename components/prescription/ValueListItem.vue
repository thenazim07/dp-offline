<script lang="ts" setup>
import { TrashIcon } from '@heroicons/vue/24/outline';
import { Bars3Icon } from '@heroicons/vue/24/solid';
const props = defineProps<{
    list: any;
    hasMarkGroupItem: boolean;
}>();
</script>

<template>
    <div
        class="min-h-72 w-auto space-y-3 overflow-y-auto px-2 py-2 pb-28 pr-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-md 2xl:h-[23rem]"
        style="max-height: calc(100vh - 30rem)"
    >
        <template
            v-for="n in 5"
            :key="n"
        >
            <table
                class="w-full cursor-pointer rounded-lg bg-slate-100"
                :class="props.hasMarkGroupItem ? 'ring-1 ring-[#136AFB]' : ''"
            >
                <tr class="">
                    <td class="py-2 pr-4">
                        <div class="flex w-[228px] items-center space-x-2">
                            <div class="px-2">
                                <Bars3Icon class="h-5 w-5 text-slate-300"></Bars3Icon>
                            </div>
                            <div>
                                <p class="font-poppins-regular text-base font-normal">Pain on hand</p>
                            </div>
                        </div>
                    </td>

                    <td class="py-2 pr-4">
                        <LibFormDropDown
                            placeholder="Side"
                            :list-data="['Left', 'Right', 'Top', 'Bottom']"
                        ></LibFormDropDown>
                    </td>

                    <td class="py-2 pr-4">
                        <LibFormDropDown
                            placeholder="Duration"
                            :list-data="['1 Day', '2 Days', '3 Days', ' 4 Days']"
                        ></LibFormDropDown>
                    </td>

                    <td class="py-2 pr-2">
                        <div class="relative">
                            <textarea
                                class="font-poppins-regular m-0 h-[3rem] w-full resize-y rounded border border-slate-200 px-3 pt-1.5 text-base text-slate-800 placeholder:text-slate-300 focus:outline-none"
                                placeholder="Note"
                            ></textarea>
                            <PrescriptionNotePopup></PrescriptionNotePopup>
                        </div>
                    </td>

                    <td>
                        <div class="w-[25px]">
                            <TrashIcon
                                v-if="!hasMarkGroupItem"
                                class="h-5 w-5 cursor-pointer text-red-500"
                            ></TrashIcon>
                            <LibFormCheckbox
                                v-else
                                class="h-5 w-5 cursor-pointer text-red-500"
                            ></LibFormCheckbox>
                        </div>
                    </td>
                </tr>
            </table>
        </template>
    </div>
</template>
