<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useEhrFamilyStoreRoot } from '~/stores/ehr/useFamilyStoreRoot';
import { usePrescriptionSavingStatusStore } from '~/stores/prescription/usePrescriptionSavingStatusStore';
const ehrFamilyStoreRoot = useEhrFamilyStoreRoot();
const { getAvailableFamily } = storeToRefs(ehrFamilyStoreRoot);
const familyData = computed(() => getAvailableFamily.value ?? []);

function handleDeleteFamilyItem(uuid: string) {
    ehrFamilyStoreRoot.removeFamilyFromPrescription(uuid);
}

const savingStatusStore = usePrescriptionSavingStatusStore();
const { status } = storeToRefs(savingStatusStore);

function retryForSaving() {
    ehrFamilyStoreRoot.syncWithServer();
}

const emit = defineEmits(['onListClick']);
</script>

<template>
    <div
        v-if="familyData.length > 0 || status.past_history_family.status === 'failed'"
        class="flex items-center justify-between gap-2"
        :class="[
            status.past_history_family.status === 'pending' ? ' pointer-events-none bg-[#F8FAFC] pt-2' : '',
            status.past_history_family.status === 'failed' ? ' bg-[#FFF7F7] pt-2' : '',
        ]"
    >
        <div class="w-full">
            <div class="flex justify-between">
                <div class="inline-block cursor-pointer">
                    <p class="py-1.5 text-base font-semibold">F/H:</p>
                </div>
                <PrescriptionCommonPrescriptionCreateSavingStatus
                    :status="status.past_history_family"
                    @retry="retryForSaving"
                />
            </div>

            <ul
                role="list"
                class="ml-2.5 pr-2"
            >
                <li
                    v-for="(family, index) in familyData"
                    :key="family.uuid"
                    class="w-fullbefore:mr- font-poppins-regular relative flex justify-between text-left text-sm font-normal leading-5 text-slate-600 before:absolute before:-inset-3 before:inset-y-0 before:h-2 before:w-2 before:content-dod"
                    @click="emit('onListClick', index)"
                >
                    <div>
                        <span class="mr-1 cursor-pointer text-sm text-slate-900">
                            {{ family.disease }}
                        </span>

                        <small
                            v-if="family.relation"
                            class="capitalize"
                        >
                            - {{ family.relation }}
                        </small>

                        <br v-if="family?.note" />

                        <small
                            v-if="family?.note"
                            class="text-xs"
                        >
                            {{ family?.note }}
                        </small>
                    </div>

                    <div>
                        <button
                            type="button"
                            class="cursor-pointer p-1.5"
                            @click.stop="handleDeleteFamilyItem(family.uuid)"
                        >
                            <TrashIcon class="h-5 w-5 font-semibold text-red-600" />
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
