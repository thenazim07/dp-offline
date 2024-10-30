<script lang="ts" setup>
import { Popover, PopoverButton } from '@headlessui/vue';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import { useHistoryStore } from '~/stores/history/useHistoryStore';
const { removedSurgicalsForPrescription } = useHistoryStore();
const { otherData } = storeToRefs(useHistoryStore());
const list = computed<Array>(() => (otherData.value ? otherData.value.surgical_histories : []));
</script>

<template>
    <div name="O/H">
        <li
            v-for="item in list"
            :key="item.ref"
        >
            <Popover class="max-w-4xl">
                <div class="flex w-full justify-between space-x-2 py-0.5 pr-2 2xl:py-1">
                    <PopoverButton
                        class="before:mr- font-poppins-regular relative text-left text-sm font-normal leading-5 text-slate-600 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod hover:bg-slate-200"
                    >
                        <span class="mr-1 text-slate-900">{{ item.surgical }} </span>
                        <small
                            v-if="item.duration && item.duration_type"
                            class="capitalize"
                        >
                            - ({{ item.duration + ' ' + item.duration_type }})
                        </small>
                    </PopoverButton>

                    <div>
                        <button @click="removedSurgicalsForPrescription(item)">
                            <TrashIcon class="h-4 w-4 text-red-500"></TrashIcon>
                        </button>
                    </div>
                </div>
            </Popover>
        </li>
    </div>
</template>
